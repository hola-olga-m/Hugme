// HugMeNow API Gateway Proxy Server
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const bodyParser = require('body-parser');
const http = require('http');

// Configuration constants
const PORTS = {
  PROXY: 3001,       // This proxy server
  NESTJS: 3000,      // NestJS backend API
  FRONTEND: 5000     // Express/React frontend
};

const SERVICES = {
  BACKEND: {
    url: `http://localhost:${PORTS.NESTJS}`,
    name: 'NestJS Backend'
  },
  FRONTEND: {
    url: `http://localhost:${PORTS.FRONTEND}`,
    name: 'Express Frontend'
  }
};

// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(bodyParser.json({
  limit: '2mb' // Increase limit for larger payloads
}));

console.log('Starting HugMeNow proxy server...');

// Debug middleware to log requests (only basic info in production)
app.use((req, res, next) => {
  console.log(`[DEBUG] ${req.method} ${req.originalUrl}`);
  
  // More detailed logging for POST requests
  if (req.method === 'POST') {
    console.log('[DEBUG] POST request to path:', req.path);
  }
  
  next();
});

// Helper function to handle request forwarding
const forwardRequest = (req, res, options) => {
  const { method, path, target, body = null } = options;
  
  // Configure request options
  const requestOptions = {
    hostname: 'localhost',
    port: new URL(target).port,
    path: path,
    method: method,
    headers: {
      ...req.headers,
      host: `localhost:${new URL(target).port}`
    }
  };
  
  // Add content headers for POST/PUT requests with bodies
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    const bodyData = JSON.stringify(body);
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.headers['Content-Length'] = Buffer.byteLength(bodyData);
  }

  // Create and send the proxied request
  const proxyReq = http.request(requestOptions, (proxyRes) => {
    console.log(`[PROXY] ${method} ${path} -> ${target} (Status: ${proxyRes.statusCode})`);
    
    // Set response status code
    res.status(proxyRes.statusCode);
    
    // Copy all response headers
    Object.keys(proxyRes.headers).forEach(key => {
      res.setHeader(key, proxyRes.headers[key]);
    });
    
    // Stream response data back to client
    proxyRes.pipe(res);
  });
  
  // Handle errors
  proxyReq.on('error', (e) => {
    console.error(`[ERROR] Proxy error: ${e.message}`);
    res.status(500).json({ 
      error: 'Proxy Error', 
      message: e.message,
      path: path,
      method: method
    });
  });
  
  // Write request body if it exists
  if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
    proxyReq.write(JSON.stringify(body));
  }
  
  proxyReq.end();
};

// Handle GraphQL GET requests (for introspection/playground)
app.get('/graphql', (req, res) => {
  console.log('[DEBUG] GraphQL GET request received');
  forwardRequest(req, res, {
    method: 'GET',
    path: '/graphql',
    target: SERVICES.BACKEND.url
  });
});

// Handle GraphQL POST requests (for queries/mutations)
app.post('/graphql', (req, res) => {
  console.log('[DEBUG] GraphQL POST request received');
  forwardRequest(req, res, {
    method: 'POST',
    path: '/graphql',
    target: SERVICES.BACKEND.url,
    body: req.body
  });
});

// Proxy API requests to NestJS server (with path rewriting)
app.use('/api', (req, res) => {
  // Remove /api prefix from path
  const path = req.url.replace(/^\/api/, '');
  
  forwardRequest(req, res, {
    method: req.method,
    path: path,
    target: SERVICES.BACKEND.url,
    body: req.body
  });
});

// Proxy all other requests to the Express frontend
app.use('/', createProxyMiddleware({
  target: SERVICES.FRONTEND.url,
  changeOrigin: true,
  logLevel: 'error',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.originalUrl} -> ${SERVICES.FRONTEND.name}`);
  },
  onError: (err, req, res) => {
    console.error(`[PROXY ERROR] ${err.message}`);
    res.status(500).json({ error: 'Proxy Error', message: err.message });
  }
}));

// Start server
app.listen(PORTS.PROXY, '0.0.0.0', () => {
  console.log(`HugMeNow proxy server running on port ${PORTS.PROXY}`);
  console.log(`- API/GraphQL requests -> ${SERVICES.BACKEND.url}`);
  console.log(`- Frontend requests -> ${SERVICES.FRONTEND.url}`);
});