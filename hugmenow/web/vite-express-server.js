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
  
  // Middleware to handle protocol compatibility issues
  app.use((req, res, next) => {
    // For API/GraphQL endpoints, add protocol compatibility headers
    if (req.path === '/graphql' || req.path.startsWith('/api/') || req.path === '/info') {
      // Add protocol compatibility headers to outgoing requests
      req.headers['accept-protocol'] = 'HTTP/1.1';
      req.headers['connection'] = 'keep-alive';
      req.headers['x-protocol-hint'] = 'HTTP1.1';
    }
    next();
  });
  
  // Configure API proxies with protocol error handling
  const proxyOptions = {
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false,
    onProxyReq: (proxyReq, req, res) => {
      // Add protocol compatibility headers to all proxy requests
      proxyReq.setHeader('Accept-Protocol', 'HTTP/1.1');
      proxyReq.setHeader('Connection', 'keep-alive');
      proxyReq.setHeader('X-Protocol-Hint', 'HTTP1.1');
    },
    onProxyRes: (proxyRes, req, res) => {
      // Handle 426 error responses
      if (proxyRes.statusCode === 426) {
        console.warn("Intercepted 426 Upgrade Required error, applying workaround");
        
        // Override headers to ensure HTTP/1.1 compatibility
        proxyRes.headers['connection'] = 'keep-alive';
        proxyRes.headers['x-protocol-used'] = 'HTTP/1.1';
        
        // Change the status code to prevent client-side errors
        proxyRes.statusCode = 200;
      }
    },
    onError: (err, req, res) => {
      console.error('Proxy error:', err);
      
      // If we get a protocol-related error, redirect to our error page
      if (err.message.includes('426') || err.message.includes('Upgrade Required')) {
        res.writeHead(302, {
          'Location': '/protocol-error?code=426&message=' + encodeURIComponent('Upgrade Required')
        });
        res.end();
      } else {
        res.writeHead(500, {
          'Content-Type': 'text/plain'
        });
        res.end('Proxy error: ' + err.message);
      }
    }
  };
  
  app.use('/api', createProxyMiddleware({
    ...proxyOptions,
    pathRewrite: {
      '^/api': ''  // remove /api prefix when proxying
    }
  }));
  
  app.use('/info', createProxyMiddleware(proxyOptions));
  
  app.use('/graphql', createProxyMiddleware(proxyOptions));

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