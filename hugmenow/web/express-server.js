import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import history from 'connect-history-api-fallback';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[EXPRESS] Received request: ${req.method} ${req.originalUrl}`);
  next();
});

// Add headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
  // intercept OPTIONS method
  if ('OPTIONS' === req.method) {
    res.sendStatus(200);
  } else {
    next();
  }
});

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

// Proxy GraphQL requests to the NestJS server
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[EXPRESS] Proxying GraphQL request: ${req.method} ${req.url} -> NestJS backend`);
  }
}));

// Enable history API fallback for React Router
// This middleware should be placed AFTER API routes but BEFORE static files
app.use(history({
  verbose: true,
  rewrites: [
    // Don't rewrite API/GraphQL requests
    { 
      from: /^\/(api|graphql|status)\/.*$/,
      to: context => context.parsedUrl.pathname
    }
  ]
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Set environment variable to know we're in production mode
process.env.NODE_ENV = 'production';

// Check if build directory exists, if not, redirect to development server
const distPath = path.join(__dirname, 'dist');
const isDevelopment = !fs.existsSync(distPath);

if (isDevelopment) {
  console.log('Development mode detected - redirecting to Vite dev server');
  // Proxy requests to Vite development server
  app.use('/', createProxyMiddleware({
    target: 'http://localhost:5173',
    changeOrigin: true,
    ws: true,
    logLevel: 'debug'
  }));
} else {
  console.log('Production mode detected - serving from dist directory');
  
  // Serve static files from the Vite build output directory with proper caching
  app.use(express.static(distPath, {
    etag: true,
    lastModified: true,
    setHeaders: (res, path) => {
      // For JS, CSS assets (contains hash in filename)
      if (path.endsWith('.js') || path.endsWith('.css')) {
        res.setHeader('Cache-Control', 'max-age=31536000, immutable');
      } else {
        // For non-hashed assets
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
  
  // For all routes not handled by static files or proxies, serve index.html
  app.get('*', (req, res) => {
    console.log(`Serving index.html for route: ${req.path}`);
    
    // For development environment, serve the basic HTML with Vite integration
    if (isDevelopment) {
      return res.sendFile(path.join(__dirname, 'public', 'index.html'));
    }
    
    // Check if requesting an asset
    if (req.path.includes('.') && !req.path.endsWith('.html')) {
      // If the route includes a dot, it's likely looking for an asset
      // Try to find it in the assets directory
      const assetPath = path.join(distPath, 'assets', path.basename(req.path));
      
      if (fs.existsSync(assetPath)) {
        return res.sendFile(assetPath);
      }
      
      // If we reach here, the asset couldn't be found in dist directory
      console.log(`Asset not found: ${req.path}`);
      return res.status(404).send(`Asset not found: ${req.path}`);
    }
    
    // For all other routes, serve the index.html for SPA routing
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`- Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`- API proxy to: http://localhost:3000`);
});