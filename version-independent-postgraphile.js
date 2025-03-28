/**
 * Version-Independent PostGraphile Proxy
 * 
 * This proxy handles GraphQL requests without relying on the GraphQL parser,
 * avoiding version conflicts entirely by using pure HTTP for communication.
 */

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';
import { createHash } from 'crypto';
import { SERVICE_NAMES, SERVICE_PORTS } from './gateway-config.js';

// Configuration - Always use port 3004 for Replit workflow compatibility
const PORT = 3004; // Fixed port for Replit workflow detection
const POSTGRAPHILE_PORT = process.env.POSTGRAPHILE_PORT || SERVICE_PORTS.POSTGRAPHILE;
const POSTGRAPHILE_ENDPOINT = `http://localhost:${POSTGRAPHILE_PORT}/postgraphile/graphql`;
const SERVICE_NAME = 'VersionIndependentPostGraphileProxy';

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

// Cache for query results (basic in-memory cache)
const queryCache = new Map();

// Function to generate cache key
function createCacheKey(query, variables) {
  const hash = createHash('md5');
  hash.update(JSON.stringify({ query, variables }));
  return hash.digest('hex');
}

// GraphQL proxy endpoint
app.post('/graphql', async (req, res) => {
  const { query, variables, operationName } = req.body;
  
  if (!query) {
    return res.status(400).json({
      errors: [{
        message: 'Missing query parameter',
        extensions: {
          code: 'MISSING_QUERY',
          service: SERVICE_NAME
        }
      }]
    });
  }
  
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
      console.log('Version-Independent Proxy: Stripped @live directive from query');
    } else {
      queryToExecute = query;
    }
    
    // Only check/save to cache for queries, not mutations
    const isQueryOp = queryToExecute.trim().startsWith('query') || 
      (!queryToExecute.trim().startsWith('mutation') && !operationName?.toLowerCase().includes('mutate'));
    const cacheKey = isQueryOp ? createCacheKey(queryToExecute, variables) : null;
    
    // Check cache for non-mutation queries
    if (isQueryOp && queryCache.has(cacheKey)) {
      const cachedResult = queryCache.get(cacheKey);
      // Add proxy info to cached response
      const resultWithExtensions = {
        ...cachedResult,
        extensions: {
          ...(cachedResult.extensions || {}),
          proxy: {
            service: SERVICE_NAME,
            cached: true,
            timestamp: new Date().toISOString()
          }
        }
      };
      
      // Add live query info if applicable
      if (isLiveQuery) {
        resultWithExtensions.extensions = {
          ...resultWithExtensions.extensions,
          liveQuery: {
            isLiveQuery: true,
            pollInterval: 2000,
            supportedOperations: ['query'],
            proxy: SERVICE_NAME
          }
        };
      }
      
      return res.json(resultWithExtensions);
    }
    
    // Not in cache or is a mutation, make request to PostGraphile
    // Get auth token from request
    const token = req.headers.authorization;
    
    // Prepare version-independent headers
    const headers = {
      'Content-Type': 'application/json'
    };
    
    // Forward auth token if present
    if (token) {
      headers['Authorization'] = token;
    }
    
    // Forward any other useful headers
    if (req.headers['x-client-version']) {
      headers['X-Client-Version'] = req.headers['x-client-version'];
    }
    
    if (req.headers['x-client-platform']) {
      headers['X-Client-Platform'] = req.headers['x-client-platform'];
    }
    
    // Forward the request to PostGraphile with the modified query (stripped @live directive)
    const response = await fetch(POSTGRAPHILE_ENDPOINT, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        query: queryToExecute, // Use the version without the @live directive
        variables,
        operationName
      })
    });
    
    // Get the response status
    const status = response.status;
    
    if (status !== 200) {
      // Handle error response
      let errorText;
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = "Could not read error response";
      }
      
      return res.status(status).json({
        errors: [{
          message: `PostGraphile error (${status}): ${errorText}`,
          extensions: {
            code: 'POSTGRAPHILE_ERROR',
            status,
            service: SERVICE_NAME
          }
        }]
      });
    }
    
    // Parse the successful response
    let result;
    try {
      result = await response.json();
    } catch (e) {
      return res.status(500).json({
        errors: [{
          message: `Error parsing PostGraphile response: ${e.message}`,
          extensions: {
            code: 'PARSE_ERROR',
            service: SERVICE_NAME
          }
        }]
      });
    }
    
    // Add proxy info to response
    const resultWithProxyInfo = {
      ...result,
      extensions: {
        ...(result.extensions || {}),
        proxy: {
          service: SERVICE_NAME,
          cached: false,
          timestamp: new Date().toISOString()
        }
      }
    };
    
    // Add live query info if applicable
    if (isLiveQuery) {
      resultWithProxyInfo.extensions = {
        ...resultWithProxyInfo.extensions,
        liveQuery: {
          isLiveQuery: true,
          pollInterval: 2000,
          supportedOperations: ['query'],
          proxy: SERVICE_NAME
        }
      };
    }
    
    // Cache the result for non-mutation queries
    if (isQueryOp && !result.errors && result.data) {
      queryCache.set(cacheKey, result);
      
      // Set cache expiry (5 minutes)
      setTimeout(() => {
        queryCache.delete(cacheKey);
      }, 5 * 60 * 1000);
    }
    
    // Return the result
    return res.json(resultWithProxyInfo);
  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      errors: [{
        message: `GraphQL proxy error: ${error.message}`,
        extensions: {
          code: 'PROXY_ERROR',
          service: SERVICE_NAME
        }
      }]
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    upstream: POSTGRAPHILE_ENDPOINT
  });
});

// Start server
const server = http.createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ${SERVICE_NAME} running on http://0.0.0.0:${PORT}`);
  console.log(`📊 GraphQL proxy endpoint: http://0.0.0.0:${PORT}/graphql`);
  console.log(`✅ Health check endpoint: http://0.0.0.0:${PORT}/health`);
  console.log(`🔗 Upstream PostGraphile API: ${POSTGRAPHILE_ENDPOINT}`);

  // Let the server listen on port 3004 specifically for Replit workflow detection
  if (PORT !== 3004) {
    const additionalServer = http.createServer((req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: 'redirected',
        message: `Please use the main port at ${PORT}`,
        mainPort: PORT
      }));
    });
    additionalServer.listen(3004, '0.0.0.0', () => {
      console.log(`⚠️ Additional listener on port 3004 for workflow detection`);
    });
  }
});