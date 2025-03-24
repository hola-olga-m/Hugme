const express = require('express');
const { createServer: createViteServer } = require('vite');
const fs = require('fs');
const path = require('path');
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

async function createServer() {
  const app = express();
  
  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      port: 3001
    },
    appType: 'spa'
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
  
  // Apply history API fallback middleware
  app.use(history({
    verbose: true,
    disableDotRule: true,
    rewrites: [
      // Don't rewrite API requests
      {
        from: /^\/api\//,
        to: context => context.parsedUrl.pathname
      },
      {
        from: /^\/info$/,
        to: context => context.parsedUrl.pathname
      },
      {
        from: /^\/graphql$/,
        to: context => context.parsedUrl.pathname
      },
      // Rewrite all other routes to index.html
      {
        from: /^\/.*$/,
        to: '/index.html'
      }
    ]
  }));

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the public directory
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Fallback: direct all other requests to index.html
  app.use('*', (req, res, next) => {
    console.log(`Catch-all route hit: ${req.originalUrl}`);
    const indexPath = path.resolve(__dirname, 'index.html');
    try {
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error('Error reading index.html:', e);
      next(e);
    }
  });

  app.listen(3001, () => {
    console.log('Server running at http://localhost:3001');
    console.log('Configured for SPA with client-side routing support');
  });
}

createServer();