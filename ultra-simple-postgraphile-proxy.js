/**
 * Ultra Simple PostGraphile Proxy
 * A pure HTTP version that avoids all usage of GraphQL libraries entirely
 */
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import http from 'http';

// Configuration
const PORT = 3005; // Fixed for testing
const POSTGRAPHILE_PORT = 3003;
const POSTGRAPHILE_ENDPOINT = `http://localhost:${POSTGRAPHILE_PORT}/postgraphile/graphql`;
const SERVICE_NAME = 'UltraSimplePostGraphileProxy';

// Create Express app without any GraphQL dependencies
const app = express();

// Setup basic middleware
app.use(cors());
app.use(bodyParser.json());

// Basic logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} [${SERVICE_NAME}] ${req.method} ${req.url}`);
  next();
});

// Simple proxy endpoint with no GraphQL dependencies at all
app.post('/graphql', async (req, res) => {
  try {
    const originalQuery = req.body.query || '';
    const variables = req.body.variables || {};
    const operationName = req.body.operationName;
    
    console.log(`Processing query: ${originalQuery.substring(0, 100)}...`);
    
    // Detect and strip @live directive using basic string manipulation (no GraphQL parsing)
    const strippedQuery = originalQuery.replace(/@live(\s*\([^)]*\))?/g, '');
    const isLiveQuery = strippedQuery !== originalQuery;
    
    if (isLiveQuery) {
      console.log('Stripped @live directive from query');
    }
    
    // Make a pure HTTP request to PostGraphile with no GraphQL dependencies
    const response = await fetch(POSTGRAPHILE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...req.headers.authorization ? { 'Authorization': req.headers.authorization } : {}
      },
      body: JSON.stringify({
        query: strippedQuery,
        variables: variables,
        operationName: operationName
      })
    });
    
    // Get response as text to avoid any GraphQL parsing
    const responseText = await response.text();
    
    try {
      // Parse the JSON manually to avoid any GraphQL-related code
      const responseData = JSON.parse(responseText);
      
      // Add our proxy info without touching any GraphQL types
      const resultWithMetadata = {
        ...responseData,
        extensions: {
          ...(responseData.extensions || {}),
          proxy: {
            name: SERVICE_NAME,
            timestamp: new Date().toISOString()
          }
        }
      };
      
      // Add live query info if applicable
      if (isLiveQuery) {
        resultWithMetadata.extensions = {
          ...resultWithMetadata.extensions,
          liveQuery: {
            enabled: true,
            poll: 2000
          }
        };
      }
      
      // Return the final result
      res.status(response.status).json(resultWithMetadata);
    } catch (parseError) {
      // If we can't parse the response, return the raw text
      res.status(response.status).send(responseText);
    }
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({
      errors: [{
        message: `Error: ${error.message}`,
        proxy: SERVICE_NAME
      }]
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: SERVICE_NAME,
    timestamp: new Date().toISOString()
  });
});

// Basic query test endpoint
app.get('/test', async (req, res) => {
  try {
    // Make a simple test query to PostGraphile
    const response = await fetch(POSTGRAPHILE_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `{ allMoods(first: 1) { nodes { id } } }`
      })
    });
    
    const result = await response.text();
    
    res.send({
      proxyStatus: 'ok',
      testQueryResult: result,
      note: "This proxy uses pure HTTP and avoids all GraphQL parsing to prevent version conflicts"
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      note: "The test query failed, but the proxy is running"
    });
  }
});

// Start server
const server = http.createServer(app);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 ${SERVICE_NAME} running on http://0.0.0.0:${PORT}`);
  console.log(`📊 GraphQL pure HTTP proxy: http://0.0.0.0:${PORT}/graphql`);
  console.log(`✅ Health check: http://0.0.0.0:${PORT}/health`);
  console.log(`🧪 Test endpoint: http://0.0.0.0:${PORT}/test`);
  console.log(`🔗 Upstream: ${POSTGRAPHILE_ENDPOINT}`);
});