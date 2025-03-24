const express = require('express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { createServer: createViteServer } = require('vite');

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode with HMR disabled to avoid WebSocket errors
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: false // Disable HMR to avoid WebSocket connection errors
    },
    appType: 'spa'
  }).catch(e => {
    console.error('Vite server creation error:', e);
    // Return a minimal object if Vite fails to initialize
    return {
      middlewares: (req, res, next) => next()
    };
  });
  
  // Configure API proxies
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }));
  
  app.use('/info', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }));
  
  app.use('/graphql', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }));

  // Custom routing middleware that preserves direct access to static files
  app.use((req, res, next) => {
    const requestPath = req.path;
    
    // Let these static asset requests pass through
    if (
      requestPath.match(/\.(js|css|png|jpg|jpeg|gif|svg|ico|json|woff|woff2|ttf|eot)$/) || 
      requestPath.startsWith('/src/') ||
      requestPath.startsWith('/assets/') ||
      requestPath.startsWith('/node_modules/') ||
      requestPath.startsWith('/@fs/') ||
      requestPath.startsWith('/@vite/') ||
      requestPath.startsWith('/@id/') ||
      requestPath === '/favicon.svg'
    ) {
      console.log(`Allowing static file request: ${requestPath}`);
      return next();
    }
    
    // Skip API endpoints
    if (
      requestPath.startsWith('/api/') || 
      requestPath === '/info' || 
      requestPath === '/graphql'
    ) {
      console.log(`Allowing API request: ${requestPath}`);
      return next();
    }
    
    // For all other requests (route navigation), rewrite to index.html
    if (requestPath !== '/' && !requestPath.includes('.')) {
      console.log(`Rewriting route for SPA: ${requestPath} -> /`);
      req.url = '/';
    }
    
    next();
  });
  
  // Use Vite's middlewares to handle all the development needs
  app.use(vite.middlewares);
  
  // Serve static files
  app.use(express.static(path.resolve(__dirname, 'public')));
  
  // Catch-all route handler for client-side routing
  app.get('*', (req, res) => {
    const indexPath = path.resolve(__dirname, 'index.html');
    
    try {
      // Read the base HTML file
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e) {
      console.error('Error reading index.html:', e);
      res.status(500).send('Server Error');
    }
  });

  // Start server
  const PORT = 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Configured for SPA with client-side routing support');
  });
}

createServer();