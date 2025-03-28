/**
 * Enhanced Simple Unified GraphQL Gateway for HugMeNow
 * 
 * A lightweight gateway that forwards GraphQL requests to PostGraphile
 * and handles versioning issues by using pure HTTP-based delegation.
 * This approach avoids GraphQL version conflicts entirely.
 */

import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';

// Configuration variables 
const PORT = process.env.PORT || 5007;
const POSTGRAPHILE_ENDPOINT = process.env.POSTGRAPHILE_ENDPOINT || 'http://localhost:3003/postgraphile/graphql';
const AUTH_ENDPOINT = process.env.AUTH_ENDPOINT || POSTGRAPHILE_ENDPOINT;
const SERVICE_NAME = process.env.SERVICE_NAME || 'UnifiedGraphQLGateway';
const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';
const CLIENT_PLATFORM = process.env.CLIENT_PLATFORM || 'web';
const CLIENT_FEATURES = process.env.CLIENT_FEATURES || 'mood-tracking,friend-moods';
const UPSTREAM_SERVICES = {
  postgraphile: POSTGRAPHILE_ENDPOINT,
  auth: AUTH_ENDPOINT
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

/**
 * Execute a GraphQL query against the underlying API
 */
async function executeGraphQL(query, variables = {}, token = null, endpoint = POSTGRAPHILE_ENDPOINT) {
  try {
    // Prepare headers
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': CLIENT_VERSION,
      'X-Client-Platform': CLIENT_PLATFORM,
      'X-Gateway-Name': SERVICE_NAME
    };
    
    // Add authorization if present
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Forward the request to the API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });
    
    // Get the response data
    return await response.json();
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

// Main GraphQL endpoint - Pure HTTP-based approach to avoid GraphQL version conflicts
app.post('/graphql', async (req, res) => {
  const { query, variables, operationName } = req.body;
  console.log(`Processing GraphQL request: ${operationName || 'Anonymous operation'}`);
  
  try {
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
    
    // Prepare headers for the upstream service
    const headers = {
      'Content-Type': 'application/json',
      'X-Client-Version': CLIENT_VERSION,
      'X-Client-Platform': CLIENT_PLATFORM,
      'X-Gateway-Service': SERVICE_NAME
    };
    
    // Add authorization if present
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Directly proxy the request to the upstream service
    console.log(`Proxying to ${endpoint} (${isAuthOperation ? 'auth' : 'data'} operation)`);
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query,
        variables,
        operationName
      })
    });
    
    // Get the response status and body
    const status = response.status;
    const result = await response.json();
    
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

// Note: WebSocket implementation is temporarily disabled due to version conflicts
// Will be re-implemented in a future update

// Log the server is starting without WebSocket support
console.log('Starting in HTTP-only mode (WebSocket support disabled)');

// Start server
httpServer.listen(PORT, '0.0.0.0', () => {
  console.log(`Enhanced Unified GraphQL Gateway listening on http://0.0.0.0:${PORT}/graphql`);
  console.log(`Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`Client info endpoint: http://0.0.0.0:${PORT}/client-info`);
  console.log(`Upstream GraphQL API: ${POSTGRAPHILE_ENDPOINT}`);
  console.log(`Upstream Auth API: ${AUTH_ENDPOINT}`);
  console.log(`WebSocket endpoint: ws://0.0.0.0:${PORT}/graphql`);
});