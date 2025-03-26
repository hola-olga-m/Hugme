const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');

// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HugMeNow Frontend',
    timestamp: new Date().toISOString()
  });
});

// Proxy API requests to the NestJS server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/' // rewrite path
  }
}));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[EXPRESS] Received request: ${req.method} ${req.originalUrl}`);
  next();
});

// Proxy GraphQL requests to the NestJS server
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[EXPRESS] Proxying GraphQL request: ${req.method} ${req.url} -> NestJS backend`);
  }
}));

// Handle POST requests that aren't handled by other routes (like GraphQL)
app.post('*', (req, res) => {
  console.log('[EXPRESS] Unhandled POST request:', req.originalUrl);
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    statusCode: 404
  });
});

// Handle all other GET routes
app.get('*', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>HugMeNow</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; margin: 0; padding: 20px; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
          h1 { color: #4a90e2; }
          pre { background: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
          .endpoints { margin-top: 20px; }
          .endpoint { margin-bottom: 10px; padding: 10px; background: #f9f9f9; border-radius: 4px; }
          .endpoint code { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>HugMeNow</h1>
          <p>Welcome to the HugMeNow mental health and wellness application.</p>
          
          <div class="endpoints">
            <h2>Available Endpoints:</h2>
            
            <div class="endpoint">
              <code>/status</code> - Check server status
            </div>
            
            <div class="endpoint">
              <code>/api/...</code> - API endpoints (proxied to NestJS backend)
            </div>
            
            <div class="endpoint">
              <code>/graphql</code> - GraphQL endpoint (proxied to NestJS backend)
            </div>
          </div>
        </div>
      </body>
    </html>
  `);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`- Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`- API proxy to: http://localhost:3000`);
});