const express = require('express');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Simple Express server for serving the React app
const app = express();

// API proxy middleware for backend NestJS server
const apiProxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // remove /api prefix when proxying
  }
});

// Set up API routes
app.use('/api', apiProxy);
app.use('/graphql', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));
app.use('/info', createProxyMiddleware({ target: 'http://localhost:3000', changeOrigin: true }));

// Set correct MIME types for JavaScript modules
app.use((req, res, next) => {
  if (req.path.endsWith('.js') || req.path.endsWith('.mjs') || req.path.endsWith('.jsx')) {
    res.set('Content-Type', 'application/javascript');
  }
  next();
});

// Explicitly serve JavaScript files with correct MIME type
app.get('*.js', (req, res, next) => {
  res.set('Content-Type', 'application/javascript');
  next();
});

// Define a list of client-side routes that should be handled by React Router
const clientRoutes = [
  '/login',
  '/register',
  '/dashboard',
  '/mood-tracker',
  '/hug-center',
  '/profile',
  '/mood-history'
];

// Create explicit handlers for each client-side route
clientRoutes.forEach(route => {
  app.get(route, (req, res) => {
    console.log(`Handling client-side route: ${route}`);
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });
});

// Serve static files from the public directory
app.use(express.static(path.resolve(__dirname, 'public')));

// Serve static files from src directory for development
app.use('/src', express.static(path.resolve(__dirname, 'src')));

// Serve the React app's index.html for all other routes
app.get('*', (req, res, next) => {
  // Only handle non-file requests to support client-side routing
  if (!req.path.includes('.')) {
    console.log(`Serving index.html for route: ${req.path}`);
    res.sendFile(path.resolve(__dirname, 'index.html'));
  } else {
    // For unknown file requests, pass to next handler which will 404
    next();
  }
});

// Start the server
const PORT = 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log('Using simplified express server for React app');
  console.log('Client-side routes configured:', clientRoutes.join(', '));
});