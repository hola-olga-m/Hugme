/**
 * HTTP-based GraphQL Gateway for HugMeNow
 * 
 * This implementation avoids GraphQL version conflicts by using HTTP-based delegation
 * rather than trying to directly merge GraphQL types from different versions.
 * 
 * Features:
 * 1. HTTP proxy-based approach for GraphQL operations
 * 2. Live Query support via @live directive
 * 3. Version-agnostic data transformation
 * 4. Event-based invalidation for real-time updates
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import fetch from 'node-fetch';
import { PubSub } from 'graphql-subscriptions';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';
import { parse, print } from 'graphql';
import { SERVICE_PORTS, SERVICE_ENDPOINTS, CLIENT_INFO } from './gateway-config.js';

// Environment variables for configuration
const PORT = process.env.PORT || SERVICE_PORTS.HTTP_GATEWAY || 5005;
const API_ENDPOINT = process.env.API_ENDPOINT || SERVICE_ENDPOINTS.POSTGRAPHILE;

console.log(`Starting HTTP Gateway on port ${PORT}, proxying to ${API_ENDPOINT}`);

// Create PubSub instance for live query updates
const pubsub = new PubSub();

// Define event topics for live query updates
const LIVE_EVENTS = {
  MOOD_UPDATED: 'MOOD_UPDATED',
  HUG_UPDATED: 'HUG_UPDATED'
};

// Cache of active live queries
const liveQueryCache = new Map();

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

/**
 * Execute a GraphQL query against the underlying API
 */
async function executeGraphQL(query, variables = {}, token = null) {
  try {
    console.log(`[HTTP Gateway] Executing GraphQL query to ${API_ENDPOINT}`);
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = token;
    }
    
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables
      })
    });
    
    return await response.json();
  } catch (error) {
    console.error('[HTTP Gateway] Error executing GraphQL query:', error);
    return { 
      errors: [{ 
        message: `Error executing query: ${error.message}`,
        locations: [],
        path: [],
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      }] 
    };
  }
}

/**
 * Process live query directives
 */
function processLiveQuery(query, operationName) {
  try {
    // Parse the query to find @live directive
    const document = parse(query);
    
    let hasLiveDirective = false;
    let queryWithoutLive = query;
    
    // Simple directive detection and removal
    if (query.includes('@live')) {
      hasLiveDirective = true;
      // Remove @live directive from the query
      queryWithoutLive = query.replace('@live', '');
      
      // Register the query in the live query cache
      const cacheKey = operationName || 'anonymous';
      console.log(`[HTTP Gateway] Registering live query: ${cacheKey}`);
      liveQueryCache.set(cacheKey, { query: queryWithoutLive, operationName });
    }
    
    return {
      hasLiveDirective,
      queryWithoutLive
    };
  } catch (error) {
    console.error('[HTTP Gateway] Error processing live query:', error);
    return { hasLiveDirective: false, queryWithoutLive: query };
  }
}

/**
 * Main GraphQL endpoint that proxies requests to the API
 * and handles @live directive processing
 */
app.post('/graphql', async (req, res) => {
  try {
    const { query, variables, operationName } = req.body;
    const token = req.headers.authorization;
    
    // Special processing for introspection queries (bypass live query processing)
    if (query.includes('__schema')) {
      const result = await executeGraphQL(query, variables, token);
      return res.json(result);
    }
    
    // Process @live directive
    const { hasLiveDirective, queryWithoutLive } = processLiveQuery(query, operationName);
    
    // Execute the query without the @live directive
    const result = await executeGraphQL(queryWithoutLive, variables, token);
    
    // Send the result
    res.json(result);
    
    // Handle mutations that should trigger live query updates
    if (query.includes('mutation') && !query.includes('IntrospectionQuery')) {
      if (query.includes('createMood') || query.includes('updateMood')) {
        console.log('[HTTP Gateway] Detected mood mutation, triggering live query updates');
        pubsub.publish(LIVE_EVENTS.MOOD_UPDATED, { 
          moodUpdated: result.data?.createMood || result.data?.updateMood,
          timestamp: new Date().toISOString()
        });
      }
      
      if (query.includes('sendHug')) {
        console.log('[HTTP Gateway] Detected hug mutation, triggering live query updates');
        pubsub.publish(LIVE_EVENTS.HUG_UPDATED, { 
          hugUpdated: result.data?.sendHug,
          timestamp: new Date().toISOString()
        });
      }
    }
  } catch (error) {
    console.error('[HTTP Gateway] Error handling GraphQL request:', error);
    res.status(500).json({ 
      errors: [{ 
        message: `Server error: ${error.message}`,
        locations: [],
        path: [],
        extensions: { code: 'INTERNAL_SERVER_ERROR' }
      }] 
    });
  }
});

// Create HTTP server
const httpServer = createServer(app);

// Create WebSocket server for GraphQL subscriptions
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql'
});

// WebSocket server configuration for live queries
const serverCleanup = useServer({
  execute: async (args) => {
    // Extract the query operation from args
    const { document, variables, operationName, contextValue } = args;
    
    // Get the HTTP headers from the WebSocket context
    const token = contextValue?.connectionParams?.Authorization || null;
    
    // Convert the document to string query
    const query = print(document);
    
    // Execute the query against the API
    return await executeGraphQL(query, variables, token);
  },
  subscribe: async (args) => {
    const { document, variables, operationName, contextValue } = args;
    
    // Convert the document to string query
    const query = print(document);
    
    // Handle live queries by subscribing to relevant events
    if (query.includes('@live')) {
      console.log(`[HTTP Gateway] WebSocket received live query: ${operationName}`);
      
      // Determine which events to subscribe to based on the query content
      const eventName = query.includes('mood') ? LIVE_EVENTS.MOOD_UPDATED : 
                        query.includes('hug') ? LIVE_EVENTS.HUG_UPDATED : null;
      
      if (!eventName) {
        throw new Error('Unsupported live query type');
      }
      
      // Use our PubSub system to handle live query events
      return pubsub.asyncIterator(eventName);
    }
    
    // For regular subscriptions, return a custom async iterator
    return {
      [Symbol.asyncIterator]() {
        return {
          async next() {
            // In a real implementation, this would connect to the actual subscription system
            // For now, we return a Promise that never resolves
            return new Promise((resolve) => {
              // This promise intentionally never resolves, keeping the subscription open
            });
          },
          async return() {
            // Clean up resources here
            return { done: true, value: undefined };
          }
        };
      }
    };
  },
  onConnect: (ctx) => {
    console.log('[HTTP Gateway] WebSocket client connected');
    return true;
  },
  onDisconnect: (ctx) => {
    console.log('[HTTP Gateway] WebSocket client disconnected');
  }
}, wsServer);

// Start HTTP server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`[HTTP Gateway] Server running at http://0.0.0.0:${PORT}/graphql`);
  console.log(`[HTTP Gateway] WebSocket server running at ws://0.0.0.0:${PORT}/graphql`);
  console.log(`[HTTP Gateway] Live Query support enabled - use @live directive on queries`);
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('[HTTP Gateway] Shutting down...');
  serverCleanup.dispose();
  httpServer.close(() => {
    console.log('[HTTP Gateway] Server stopped');
    process.exit(0);
  });
});