/**
 * Enhanced Simple Unified GraphQL Gateway for HugMeNow
 * 
 * A lightweight gateway that forwards GraphQL requests to PostGraphile
 * and handles versioning issues by using pure HTTP-based delegation.
 * This approach avoids GraphQL version conflicts entirely.
 * 
 * Features:
 * - HTTP-based GraphQL request forwarding
 * - Live Query support via @live directive
 * - Authentication forwarding
 * - Field name normalization for client compatibility
 */

import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import { WebSocketServer } from 'ws';
// Don't import parse/print from graphql to avoid version conflicts
import { createHash } from 'crypto';

// Import gateway configuration
import config, { SERVICE_NAMES, SERVICE_PORTS, SERVICE_ENDPOINTS, CLIENT_INFO } from './gateway-config.js';

// Configuration variables 
const PORT = process.env.PORT || SERVICE_PORTS.SIMPLE_UNIFIED_GATEWAY;

// Use Version-Independent Proxy for PostGraphile
const VERSION_INDEPENDENT_PORT = SERVICE_PORTS.POSTGRAPHILE + 1;
const POSTGRAPHILE_ENDPOINT = process.env.POSTGRAPHILE_ENDPOINT || 
  `http://localhost:${VERSION_INDEPENDENT_PORT}/graphql`;
const DIRECT_POSTGRAPHILE_ENDPOINT = SERVICE_ENDPOINTS.POSTGRAPHILE;

const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT || POSTGRAPHILE_ENDPOINT;
const SERVICE_NAME = process.env.SERVICE_NAME || SERVICE_NAMES.SIMPLE_UNIFIED_GATEWAY;
const CLIENT_VERSION = process.env.CLIENT_VERSION || CLIENT_INFO.VERSION;
const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || CLIENT_INFO.PLATFORM;
const CLIENT_FEATURES = process.env.CLIENT_FEATURES || CLIENT_INFO.FEATURES.join(',');
const POLL_INTERVAL = process.env.POLL_INTERVAL || 2000; // Live query poll interval in ms
const UPSTREAM_SERVICES = {
  postgraphile: POSTGRAPHILE_ENDPOINT,
  directPostgraphile: DIRECT_POSTGRAPHILE_ENDPOINT,
  auth: AUTH_ENDPOINT,
  versionIndependentProxy: `http://localhost:${VERSION_INDEPENDENT_PORT}/graphql`
};

// Create Express app
const app = express();

// Setup middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${SERVICE_NAME}] ${req.method} ${req.url}`);
  next();
});

// Store active live query connections
const liveQueryConnections = new Map();

// Create a hash for query caching/identification
function createQueryHash(query, variables) {
  const hash = createHash('md5');
  hash.update(JSON.stringify({ query, variables }));
  return hash.digest('hex');
}

/**
 * Execute a GraphQL query against the underlying API
 * Pure HTTP-based implementation to avoid any GraphQL version conflicts
 * 
 * This implementation is deliberately "GraphQL library-free" to prevent any dependency
 * on GraphQL types or parsing which could cause version conflicts.
 */
async function executeGraphQL(query, variables = {}, token = null, endpoint = POSTGRAPHILE_ENDPOINT) {
  try {
    // Check if this is a live query and strip the @live directive to avoid conflicts
    // Using regex-only approach to avoid importing any GraphQL parsing libraries
    let queryToExecute = query;
    
    // More comprehensive regex pattern to safely handle directives in various positions
    const liveDirectiveRegex = /@live(\s*\([^)]*\))?/g;
    
    if (liveDirectiveRegex.test(query)) {
      // Remove the @live directive using regex without any GraphQL parsing
      queryToExecute = query.replace(liveDirectiveRegex, '');
      console.log('[executeGraphQL] Stripped @live directive from query');
    }
    
    // Prepare headers - deliberately avoid any GraphQL-specific headers
    // that might trigger version detection/validation
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': CLIENT_VERSION,
      'X-Client-Platform': CLIENT_PLATFORM,
      'X-Gateway-Name': SERVICE_NAME,
      'X-Version-Independent': 'true'  // Signal that this is a version-independent request
    };
    
    // Add authorization if present
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Forward the request to the API using pure HTTP with minimal processing
    // This bypasses all GraphQL parsing to avoid version conflicts
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        query: queryToExecute, 
        variables 
      }),
    });
    
    // Get the response status
    const status = response.status;
    
    // Handle non-200 responses with generic error handling
    // (avoiding any GraphQL-specific error handling)
    if (status !== 200) {
      console.error(`[Unified Gateway] API returned status ${status}`);
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Could not read error response";
      }
      
      return {
        errors: [{
          message: `API error (${status}): ${errorText}`,
          extensions: {
            code: 'API_ERROR',
            status,
            service: SERVICE_NAME
          }
        }]
      };
    }
    
    // Get the response data with minimal processing
    const result = await response.json();
    
    // Return a clean result without any GraphQL-specific handling
    return result;
  } catch (error) {
    console.error('[Unified Gateway] Error executing GraphQL:', error);
    return { 
      errors: [{ 
        message: `Error executing query: ${error.message}`,
        extensions: { 
          code: 'GATEWAY_ERROR',
          service: SERVICE_NAME 
        }
      }] 
    };
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    clientInfo: {
      version: CLIENT_VERSION,
      platform: CLIENT_PLATFORM,
      features: CLIENT_FEATURES.split(',')
    },
    upstreamServices: UPSTREAM_SERVICES
  });
});

// Client info endpoint
app.get('/client-info', (req, res) => {
  res.json({
    version: CLIENT_VERSION,
    platform: CLIENT_PLATFORM,
    features: CLIENT_FEATURES.split(','),
    gateway: SERVICE_NAME
  });
});

// Schema translation helper endpoint
app.post('/translate', (req, res) => {
  const { query } = req.body;
  
  if (!query) {
    return res.status(400).json({
      error: 'Missing query parameter'
    });
  }
  
  // Apply field naming transformations for client compatibility
  let transformedQuery = query;
  
  // Transform snake_case to camelCase
  transformedQuery = transformedQuery.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
  
  // Add custom field transformations for backwards compatibility
  const fieldMappings = {
    'fullName': 'name',        // Map fullName to name
    'avatarURL': 'avatarUrl',  // Normalize URL casing
    'publicMoods': 'allMoods(condition: {isPublic: true})', // Map publicMoods to filtered allMoods
    'friendsMoods': 'allMoods(condition: {userId: $friendId})' // Map friendsMoods to filtered allMoods
  };
  
  // Apply field mappings
  Object.entries(fieldMappings).forEach(([clientField, dbField]) => {
    const regex = new RegExp(`\\b${clientField}\\b`, 'g');
    transformedQuery = transformedQuery.replace(regex, dbField);
  });
  
  // Return the transformed query
  res.json({
    original: query,
    transformed: transformedQuery,
    fieldMappings
  });
});

/**
 * A special endpoint for live query support that completely avoids GraphQL version conflicts 
 * by processing the @live directive on the gateway side using only regex matching
 */
app.post('/live-query', async (req, res) => {
  const { query, variables, operationName, pollInterval } = req.body;
  const token = req.headers.authorization;
  
  // Validate required parameters
  if (!query) {
    return res.status(400).json({
      errors: [{
        message: 'Missing query parameter',
        extensions: {
          code: 'MISSING_QUERY'
        }
      }]
    });
  }
  
  try {
    // Use regex to check for @live directive instead of GraphQL parsing
    // This completely avoids GraphQL version conflicts by not using any GraphQL libraries
    let isLiveQuery = false;
    let strippedQuery = query;
    
    // More comprehensive regex pattern to safely handle directives in various positions
    const liveDirectiveRegex = /@live(\s*\([^)]*\))?/g;
    isLiveQuery = liveDirectiveRegex.test(query);
    
    // If it's a live query, strip the @live directive using regex
    if (isLiveQuery) {
      // Remove the @live directive using regex without any GraphQL parsing
      strippedQuery = query.replace(liveDirectiveRegex, '');
      console.log('Stripped @live directive for query execution');
    }
    
    // Execute query directly with a pure HTTP request with version-independent headers
    // This completely bypasses GraphQL library version conflicts
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': CLIENT_VERSION,
      'X-Client-Platform': CLIENT_PLATFORM,
      'X-Gateway-Name': SERVICE_NAME,
      'X-Version-Independent': 'true', // Signal this is a version-independent request
      'X-GraphQL-Gateway': 'UnifiedVersionIndependent'
    };
    
    // Add authorization if present
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Directly make the HTTP request with minimal processing
    // Convert the GraphQL query to a plain HTTP request to avoid any GraphQL version conflicts
    const response = await fetch(POSTGRAPHILE_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: strippedQuery,
        variables,
        operationName
      })
    });
    
    // Get the response as JSON with error handling
    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return res.status(500).json({
        errors: [{
          message: 'Error parsing API response',
          extensions: {
            code: 'RESPONSE_PARSE_ERROR'
          }
        }]
      });
    }
    
    // Add metadata about live query support without modifying any GraphQL-specific structures
    // This avoids any GraphQL type conflicts
    const resultWithExtensions = {
      ...result,
      extensions: {
        ...(result.extensions || {}),
        liveQuery: {
          isLiveQuery,
          pollInterval: isLiveQuery ? (pollInterval || POLL_INTERVAL).toString() : null,
          supportedOperations: ['query'],
          gateway: SERVICE_NAME
        }
      }
    };
    
    // Return query result with live query metadata
    return res.json(resultWithExtensions);
  } catch (error) {
    console.error('Live query error:', error);
    return res.status(500).json({
      errors: [{
        message: `Live query error: ${error.message}`,
        extensions: {
          code: 'LIVE_QUERY_ERROR',
          gateway: SERVICE_NAME
        }
      }]
    });
  }
});

// Special endpoint for authentication operations
app.post('/auth', async (req, res) => {
  const { query, variables, operationName } = req.body;
  console.log(`Processing Auth request: ${operationName || 'Anonymous operation'}`);
  
  try {
    const token = req.headers.authorization;
    const result = await executeGraphQL(query, variables, token, AUTH_ENDPOINT);
    return res.json(result);
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      errors: [{
        message: `Auth gateway error: ${error.message}`,
        extensions: {
          code: 'AUTH_GATEWAY_ERROR',
          service: SERVICE_NAME
        }
      }]
    });
  }
});

// Main GraphQL endpoint - Pure HTTP-based approach completely avoiding GraphQL version conflicts
app.post('/graphql', async (req, res) => {
  const { query, variables, operationName } = req.body;
  console.log(`Processing GraphQL request: ${operationName || 'Anonymous operation'}`);
  
  try {
    // Check if this is a live query and needs directive stripping
    let queryToExecute = query;
    let isLiveQuery = false;
    
    // Use regex pattern to detect and handle @live directive without GraphQL parsing
    const liveDirectiveRegex = /@live(\s*\([^)]*\))?/g;
    isLiveQuery = liveDirectiveRegex.test(query);
    
    // If it's a live query, strip the @live directive using regex (no GraphQL parsing)
    if (isLiveQuery) {
      queryToExecute = query.replace(liveDirectiveRegex, '');
      console.log('Main endpoint: Stripped @live directive from query');
    }
    
    // Determine if this is an auth-related operation
    const isAuthOperation = (
      operationName === 'Login' || 
      operationName === 'Register' || 
      query?.includes('login') || 
      query?.includes('register') ||
      query?.includes('authenticate')
    );
    
    // Select the appropriate endpoint based on operation type
    const endpoint = isAuthOperation ? AUTH_ENDPOINT : POSTGRAPHILE_ENDPOINT;
    
    // Get the auth token from headers
    const token = req.headers.authorization;
    
    // Prepare version-independent headers for the upstream service
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': CLIENT_VERSION,
      'X-Client-Platform': CLIENT_PLATFORM,
      'X-Gateway-Service': SERVICE_NAME,
      'X-Version-Independent': 'true',  // Signal version independence
      'X-GraphQL-Gateway': 'UnifiedVersionIndependent'
    };
    
    // Add authorization if present
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Directly proxy the request to the upstream service with minimal processing
    console.log(`Proxying to ${endpoint} (${isAuthOperation ? 'auth' : 'data'} operation)`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: queryToExecute,  // Use the version without @live directive if needed
        variables,
        operationName
      })
    });
    
    // Get the response status
    const status = response.status;
    
    // Handle the response with proper error handling
    let result;
    try {
      result = await response.json();
    } catch (e) {
      console.error('Error parsing JSON response:', e);
      return res.status(500).json({
        errors: [{
          message: 'Error parsing API response',
          extensions: {
            code: 'RESPONSE_PARSE_ERROR',
            gateway: SERVICE_NAME
          }
        }]
      });
    }
    
    // Add live query info if applicable
    if (isLiveQuery && result && result.data) {
      result.extensions = {
        ...(result.extensions || {}),
        liveQuery: {
          isLiveQuery: true,
          supportedOperations: ['query'],
          gateway: SERVICE_NAME,
          message: 'For better live query support, use the /live-query endpoint'
        }
      };
    }
    
    // Set the appropriate status code and return the result
    res.status(status).json(result);
  } catch (error) {
    console.error('GraphQL gateway error:', error);
    return res.status(500).json({
      errors: [{
        message: `Gateway error: ${error.message}`,
        extensions: {
          code: 'GATEWAY_ERROR',
          service: SERVICE_NAME
        }
      }]
    });
  }
});

// Create HTTP server
const httpServer = http.createServer(app);

// Add WebSocket support for live queries
const wsServer = new WebSocketServer({
  server: httpServer,
  path: '/graphql',
});

// Handle WebSocket connections
wsServer.on('connection', (ws) => {
  console.log(`WebSocket client connected`);
  let connectionId = Math.random().toString(36).substring(2, 15);
  let connectionParams = {};
  let pingInterval;
  
  // Store connection info
  liveQueryConnections.set(connectionId, {
    ws,
    liveQueries: new Map(),
    connectionParams,
    token: null,
  });
  
  // Set up ping interval to keep connection alive
  pingInterval = setInterval(() => {
    if (ws.readyState === ws.OPEN) {
      ws.send(JSON.stringify({
        type: 'ka' // keepalive
      }));
    }
  }, 30000);
  
  // Handle WebSocket messages
  ws.on('message', async (message) => {
    let parsedMessage;
    
    try {
      parsedMessage = JSON.parse(message);
    } catch (err) {
      console.error(`Invalid message format: ${message}`);
      ws.send(JSON.stringify({
        type: 'error',
        id: parsedMessage?.id,
        payload: {
          message: 'Invalid message format',
          code: 'INVALID_MESSAGE_FORMAT'
        }
      }));
      return;
    }

    const { id, type, payload } = parsedMessage;
    
    // Handle connection initialization
    if (type === 'connection_init') {
      console.log('Connection initialized:', id);
      connectionParams = payload || {};
      
      // Extract token from connection params if available
      if (connectionParams.authorization) {
        liveQueryConnections.get(connectionId).token = connectionParams.authorization;
      }
      
      // Acknowledge connection initialization
      ws.send(JSON.stringify({
        type: 'connection_ack',
        payload: {
          connectionId,
          features: CLIENT_FEATURES.split(','),
          version: CLIENT_VERSION
        }
      }));
      return;
    }
    
    // Handle subscription/query start
    if (type === 'start') {
      const { query, variables, operationName } = payload;
      
      // Check if this is a live query (has @live directive) using regex
      // This completely avoids GraphQL version conflicts by not using any GraphQL libraries
      let isLiveQuery = false;
      let modifiedQuery = query;
      
      try {
        // More comprehensive regex pattern to safely handle directives in various positions
        const liveDirectiveRegex = /@live(\s*\([^)]*\))?/g;
        isLiveQuery = liveDirectiveRegex.test(query);
        
        // If it's a live query, strip the @live directive using regex without any GraphQL parsing
        if (isLiveQuery) {
          // Remove the @live directive using regex - avoid any GraphQL parsing
          modifiedQuery = query.replace(liveDirectiveRegex, '');
          console.log('WebSocket: Stripped @live directive from query');
        }
      } catch (err) {
        console.error(`Error processing query: ${err}`);
        ws.send(JSON.stringify({
          type: 'error',
          id,
          payload: {
            message: `Error processing query: ${err.message}`,
            gateway: SERVICE_NAME
          }
        }));
        return;
      }
      
      // Get token from connection
      const token = liveQueryConnections.get(connectionId).token;
      
      // Initial execution of the query with modified query (to avoid live directive conflicts)
      const result = await executeGraphQL(modifiedQuery, variables, token);
      
      // Send initial result
      ws.send(JSON.stringify({
        type: 'data',
        id,
        payload: result
      }));
      
      // For live queries, set up polling
      if (isLiveQuery) {
        console.log(`Setting up live query: ${operationName || 'Anonymous'}`);
        
        // Create query hash for identification
        const queryHash = createQueryHash(query, variables);
        
        // Set up polling interval for this live query
        const intervalId = setInterval(async () => {
          try {
            // Skip if connection is closed
            if (ws.readyState !== ws.OPEN) {
              return;
            }
            
            // Re-execute query with modified query (without @live directive)
            const updatedResult = await executeGraphQL(modifiedQuery, variables, token);
            
            // Compare with previous result (simple string comparison for now)
            const previousResultStr = JSON.stringify(result);
            const newResultStr = JSON.stringify(updatedResult);
            
            // Only send if the result has changed
            if (previousResultStr !== newResultStr) {
              ws.send(JSON.stringify({
                type: 'data',
                id,
                payload: updatedResult
              }));
              
              // Update the stored result
              result.data = updatedResult.data;
            }
          } catch (error) {
            console.error(`Live query error: ${error.message}`);
            ws.send(JSON.stringify({
              type: 'error',
              id,
              payload: {
                message: `Live query error: ${error.message}`
              }
            }));
          }
        }, POLL_INTERVAL);
        
        // Store live query information with both original and modified query
        liveQueryConnections.get(connectionId).liveQueries.set(id, {
          query,
          modifiedQuery, // Store the version without @live directive
          variables,
          operationName,
          intervalId,
          queryHash
        });
      } else {
        // For non-live queries, send complete message
        ws.send(JSON.stringify({
          type: 'complete',
          id
        }));
      }
    }
    
    // Handle stopping a query or subscription
    if (type === 'stop') {
      const connection = liveQueryConnections.get(connectionId);
      if (connection && connection.liveQueries.has(id)) {
        // Clear interval for this live query
        clearInterval(connection.liveQueries.get(id).intervalId);
        // Remove from tracked live queries
        connection.liveQueries.delete(id);
        console.log(`Stopped live query: ${id}`);
      }
      
      // Send complete message
      ws.send(JSON.stringify({
        type: 'complete',
        id
      }));
    }
  });
  
  // Handle WebSocket close
  ws.on('close', () => {
    console.log(`WebSocket client disconnected (${connectionId})`);
    
    // Clean up intervals
    clearInterval(pingInterval);
    
    // Get connection info
    const connection = liveQueryConnections.get(connectionId);
    if (connection) {
      // Clean up all live query intervals
      for (const [_, liveQuery] of connection.liveQueries) {
        clearInterval(liveQuery.intervalId);
      }
      
      // Remove connection
      liveQueryConnections.delete(connectionId);
    }
  });
});

// Log server starting
console.log(`Starting ${SERVICE_NAME} with WebSocket and Live Query support...`);

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`${SERVICE_NAME} listening on http://0.0.0.0:${PORT}/graphql`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`Client info endpoint: http://0.0.0.0:${PORT}/client-info`);
  console.log(`Translate endpoint: http://0.0.0.0:${PORT}/translate`);
  console.log(`Live Query endpoint: http://0.0.0.0:${PORT}/live-query`);
  console.log(`Upstream GraphQL API: ${POSTGRAPHILE_ENDPOINT}`);
  console.log(`Upstream Auth API: ${AUTH_ENDPOINT}`);
  console.log(`WebSocket endpoint (Live Queries): ws://0.0.0.0:${PORT}/graphql`);
  console.log(`Supported features: ${CLIENT_FEATURES}`);
});