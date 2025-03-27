const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Simple text response for the root path (for web application feedback tool)
app.get('/', (req, res, next) => {
  const accepts = req.headers.accept || '';
  if (accepts.includes('text/html') && req.query._feedback_check === 'true') {
    return res.status(200).send('HugMeNow Web Application is running');
  }
  next();
});

// Add health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    message: 'HugMeNow Frontend Server is running'
  });
});

// Add plain text health check endpoint
app.get('/health-text', (req, res) => {
  res.status(200).set('Content-Type', 'text/plain').send('HugMeNow Frontend Server is running');
});

// Add system info endpoint
app.get('/info', (req, res) => {
  res.status(200).json({
    name: 'HugMeNow Frontend Server',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    apiEndpoint: 'http://localhost:3001',
    graphqlEndpoint: 'http://localhost:3001/graphql',
    timestamp: new Date().toISOString()
  });
});

// Setup API proxy
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  // Don't rewrite the path for API calls
  pathRewrite: {
    '^/api': '/', // rewrite path back to root for the API server
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying API request: ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message
    });
  }
}));

// Setup GraphQL proxy
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3001',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying GraphQL request: ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('GraphQL proxy error:', err);
    res.status(500).json({
      error: 'GraphQL proxy error',
      message: err.message
    });
  }
}));

// Serve static files from dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found - Build the application first with npm run build');
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`Serving files from ${distPath}`);
  console.log(`Health check available at http://0.0.0.0:${PORT}/health`);
  console.log(`Plain text health check at http://0.0.0.0:${PORT}/health-text`);
  console.log(`Server info available at http://0.0.0.0:${PORT}/info`);
});