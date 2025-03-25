// Next.js-compatible server for Replit
const express = require('express');
const next = require('next');

// Determine environment, use development for Replit
const dev = process.env.NODE_ENV !== 'production';
console.log(`Running in ${dev ? 'development' : 'production'} mode`);

// Initialize Next.js
const app = next({ dev });
const handle = app.getRequestHandler();

// Define port - must use 5000 for Replit
const PORT = 5000;

// Prepare Next.js then start Express
app.prepare()
  .then(() => {
    const server = express();
    
    // Log all requests
    server.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
      next();
    });
    
    // Health check endpoint
    server.get('/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        nextReady: true,
        environment: dev ? 'development' : 'production'
      });
    });
    
    // Default handler for all other routes (Next.js)
    server.all('*', (req, res) => {
      return handle(req, res);
    });
    
    // Start the server
    server.listen(PORT, '0.0.0.0', (err) => {
      if (err) throw err;
      console.log(`> Next.js ready, server listening on http://0.0.0.0:${PORT}`);
    });
    
    // Regular heartbeat
    setInterval(() => {
      console.log(`Server heartbeat: ${new Date().toISOString()}`);
    }, 5000);
  })
  .catch(err => {
    console.error('An error occurred starting the server:');
    console.error(err);
    process.exit(1);
  });