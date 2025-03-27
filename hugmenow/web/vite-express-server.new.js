// vite-express-server.js - Express server for serving Vite React app in production
const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { join, dirname } = require('path');
const fs = require('fs');
const history = require('connect-history-api-fallback');

// Import environment variables if .env file exists
require('dotenv').config();

// Set up constants
const PORT = process.env.PORT || 5000;
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

// Determine project paths
const currentDir = dirname(require.main.filename);
const projectRoot = currentDir; // This is the hugmenow/web directory
const publicPath = join(projectRoot, 'public');
const distPath = join(projectRoot, 'dist');
const srcPath = join(projectRoot, 'src');

// Create a minimal HTML file for development
const minimalHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>HugMeNow - Emotional Wellness Platform</title>
    <style>
      body { 
        font-family: Arial, sans-serif; 
        margin: 0;
        padding: 0;
      }
      #root {
        min-height: 100vh;
      }
      .app-loading {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100vh;
        text-align: center;
      }
      .loader {
        border: 5px solid #f3f3f3;
        border-top: 5px solid #5E35B1;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        animation: spin 1s linear infinite;
        margin-bottom: 20px;
      }
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
    <!-- Import React development scripts directly -->
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-router-dom@6/umd/react-router-dom.development.js"></script>
  </head>
  <body>
    <div id="root">
      <div class="app-loading">
        <div class="loader"></div>
        <h2>HugMeNow</h2>
        <p>Loading application...</p>
      </div>
    </div>
    <script>
      document.addEventListener('DOMContentLoaded', function() {
        console.log('HugMeNow initializing...');
        console.log('DOM fully loaded');
        
        // Simple script to display a welcome message until React loads
        setTimeout(() => {
          const loadingEl = document.querySelector('.app-loading');
          if (loadingEl) {
            loadingEl.innerHTML = '<h2>HugMeNow</h2><p>Welcome to the emotional wellness platform!</p>';
          }
        }, 2000);
      });
    </script>
  </body>
</html>`;

// Create Express app
const app = express();

// Add CORS to handle cross-origin requests
app.use(cors());

// Add request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Setup API proxy middleware for backend requests
app.use('/api', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // Remove /api prefix when forwarding
  },
  onError: (err, req, res) => {
    console.error('API Proxy Error:', err);
    res.status(502).send('API Gateway error!');
  }
}));

// GraphQL proxy
app.use('/graphql', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('GraphQL Proxy Error:', err);
    res.status(502).send('GraphQL Gateway error!');
  }
}));

// App info proxy 
app.use('/info', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Info Proxy Error:', err);
    res.status(502).send('Info Gateway error!');
  }
}));

// Express security headers
app.use((req, res, next) => {
  // Add security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  
  // Add CORS headers
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  next();
});

// Serve source files directly for development - bypass Vite build
app.use('/src', express.static(srcPath));

// Serve files from /public directory
app.use(express.static(publicPath));

// Use history API fallback for client-side routing
app.use(history({
  verbose: true,
  rewrites: [
    // Don't rewrite API requests
    { 
      from: /^\/(api|graphql|info)\/.*$/,
      to: context => context.parsedUrl.pathname
    }
  ]
}));

// Always use minimal HTML as the entry point for the SPA
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(minimalHtml);
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke on the server!');
});

// Start the server
console.log(`Starting server on port ${PORT}...`);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`### SERVER LISTENING ON PORT ${PORT} ###`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API proxy configured to: ${API_HOST}`);
  console.log('Server is ready to accept connections!');
});