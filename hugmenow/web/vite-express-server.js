const express = require('express');
const fs = require('fs');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const history = require('connect-history-api-fallback');

// Define constants
const PORT = 3001;
const API_URL = 'http://localhost:3000';
const CLIENT_ROUTES = [
  '/login',
  '/register',
  '/dashboard',
  '/mood-tracker',
  '/hug-center',
  '/profile',
  '/mood-history'
];

// Determine the Replit hostname if available
const REPLIT_DOMAIN = process.env.REPLIT_DOMAIN || null;
const PUBLIC_URL = REPLIT_DOMAIN ? `https://${REPLIT_DOMAIN}` : `http://localhost:${PORT}`;

// Write the public URL to .env file for frontend to use
fs.writeFileSync(path.join(__dirname, '.env'), `PUBLIC_URL=${PUBLIC_URL}\n`);
console.log(`📝 Set PUBLIC_URL=${PUBLIC_URL} in .env`);

async function startServer() {
  try {
    const app = express();
    
    // Enhanced logging middleware for debugging
    app.use((req, res, next) => {
      const { method, url, headers } = req;
      console.log(`🔍 ${method} ${url} - Referrer: ${headers.referer || 'None'}`);
      next();
    });

    // Block requests to non-existent favicon.ico to reduce noise
    app.get('/favicon.ico', (req, res) => res.status(204).end());

    // Static file middleware for assets
    app.use('/assets', express.static(path.join(__dirname, 'dist/assets')));
    
    // API routes - proxy these before the history API fallback
    const apiRoutes = ['/api', '/graphql', '/info', '/login', '/register', '/anonymous-login'];
    
    // Create proxy middleware for each API route
    apiRoutes.forEach(route => {
      // Remove /api prefix when proxying to NestJS
      const pathRewrite = route === '/api' ? { '^/api': '' } : undefined;
      
      app.use(route, createProxyMiddleware({
        target: API_URL,
        changeOrigin: true,
        pathRewrite,
        logLevel: 'error',
        onError: (err, req, res) => {
          console.error(`Proxy error for ${route}:`, err.message);
          res.status(500).send(`Proxy error for ${route}: ${err.message}`);
        }
      }));
    });

    // Create a custom rewrite rule function for the history API fallback
    const rewriteFunction = (path) => {
      // Handle client-side routes
      if (CLIENT_ROUTES.some(route => path.match(new RegExp(`^${route}($|/|\\?)`)) !== null)) {
        console.log(`🔄 Rewriting client route ${path} to index.html`);
        return '/index.html';
      }
      
      // For static files, don't rewrite
      if (path.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico)($|\?)/)) {
        console.log(`📁 Not rewriting static file ${path}`);
        return path;
      }
      
      // Default behavior - serve index.html for client-side routing
      console.log(`🔄 Default rewrite for ${path} to index.html`);
      return '/index.html';
    };

    // Apply the history API fallback middleware
    app.use(history({
      disableDotRule: true,
      verbose: true,
      rewrites: [
        // Don't rewrite API requests
        { 
          from: /^\/(api|graphql|info|login|register|anonymous-login)($|\/)/, 
          to: (context) => context.parsedUrl.pathname 
        },
        // For all other requests, use our custom rewrite function
        { from: /^\/.*$/, to: (context) => rewriteFunction(context.parsedUrl.pathname) }
      ]
    }));

    // Serve the index.html file
    app.get('*', (req, res) => {
      console.log(`🌐 Serving index.html for path: ${req.path}`);
      
      // In development, use Vite to serve the React app
      if (process.env.NODE_ENV !== 'production') {
        const { createServer } = require('vite');
        createServer({
          root: __dirname,
          server: { middlewareMode: true }
        }).then(vite => {
          app.use(vite.middlewares);
        });
      } else {
        // In production, serve the built app
        res.sendFile(path.join(__dirname, 'dist/index.html'));
      }
    });

    // Start the server
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running at ${PUBLIC_URL}`);
      console.log(`🔗 API server at ${API_URL}`);
      console.log(`📱 Client-side routes: ${CLIENT_ROUTES.join(', ')}`);
    });
  } catch (error) {
    console.error('💥 Server startup error:', error);
    process.exit(1);
  }
}

startServer();