const express = require('express');
const { createServer: createViteServer } = require('vite');
const path = require('path');
const fs = require('fs');
const { createProxyMiddleware } = require('http-proxy-middleware');

async function startServer() {
  const app = express();
  
  // Create Vite server
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa'
  });

  // Use Vite middleware for development
  app.use(vite.middlewares);

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

  // Serve static files
  app.use(express.static(path.resolve(__dirname, 'public')));
  
  // Set correct MIME types for JavaScript modules
  app.use((req, res, next) => {
    if (req.path.endsWith('.js') || req.path.endsWith('.mjs') || req.path.endsWith('.jsx')) {
      res.set('Content-Type', 'application/javascript');
    }
    next();
  });

  // All other requests are redirected to index.html for client-side routing
  app.get('*', (req, res, next) => {
    // Skip if the request is for a static asset or API endpoint
    if (
      req.path.includes('.') || 
      req.path.startsWith('/api/') || 
      req.path === '/graphql' || 
      req.path === '/info'
    ) {
      return next();
    }

    console.log(`Serving index.html for client route: ${req.path}`);
    res.sendFile(path.resolve(__dirname, 'index.html'));
  });

  // Start the server
  const PORT = 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('React app is available with client-side routing');
  });
}

startServer().catch(e => {
  console.error('Error starting server:', e);
  process.exit(1);
});