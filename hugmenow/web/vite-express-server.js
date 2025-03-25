const express = require('express');
const { createServer: createViteServer } = require('vite');
const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');
const path = require('path');

async function startServer() {
  try {
    const app = express();
    
    // Log all incoming requests for debugging
    app.use((req, res, next) => {
      console.log(`🔍 Request: ${req.method} ${req.url}`);
      next();
    });

    // API proxies first (before history API fallback)
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

    // Configure history API fallback for SPA routing
    app.use(history({
      // Don't rewrite API requests
      rewrites: [
        { 
          from: /^\/(api|graphql|info|assets|favicon|static)\/.*$/, 
          to: function(context) {
            return context.parsedUrl.pathname;
          }
        }
      ],
      verbose: true,
      logger: console.log.bind(console)
    }));

    // Create Vite server in middleware mode and use its middleware
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
      configFile: path.resolve(__dirname, 'vite.config.js'),
    });

    app.use(vite.middlewares);

    // Define routes we want to ensure are handled by the client
    const clientRoutes = [
      '/login',
      '/register',
      '/dashboard',
      '/mood-tracker',
      '/hug-center',
      '/profile',
      '/mood-history'
    ];
    
    console.log('📱 Client-side routes configured:', clientRoutes.join(', '));

    const PORT = 3001;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`⚡️ Vite + Express server running at http://localhost:${PORT}`);
      console.log(`🔄 History API fallback configured for SPA navigation`);
      console.log(`🔗 API proxies configured for backend NestJS server`);
    });
  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
}

startServer();