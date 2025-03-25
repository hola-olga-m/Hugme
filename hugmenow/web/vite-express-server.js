const express = require('express');
const { createServer: createViteServer } = require('vite');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

async function startServer() {
  try {
    const app = express();
    
    // Create Vite server in middleware mode
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: path.resolve(__dirname, 'vite.config.js'),
    });

    // Use Vite's connect instance as middleware
    app.use(vite.middlewares);
    
    // API proxy for the NestJS backend
    app.use('/api', createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      logLevel: 'debug',
      pathRewrite: {
        '^/api': '' // remove /api prefix when proxying
      }
    }));
    
    app.use('/graphql', createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      logLevel: 'debug'
    }));
    
    app.use('/info', createProxyMiddleware({
      target: 'http://localhost:3000',
      changeOrigin: true,
      logLevel: 'debug'
    }));

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
      app.use(route, (req, res, next) => {
        // Let Vite handle these routes for SPA navigation
        console.log(`Handling client-side route: ${route}`);
        req.url = '/'; // Rewrite to root to serve index.html
        next();
      });
    });

    const PORT = 3001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚡️ Vite + Express server running at http://localhost:${PORT}`);
      console.log(`🔄 Client-side routes configured for React Router`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();