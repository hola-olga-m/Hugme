// Vite dev server for the React application
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables if available
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  console.log('Loading environment variables from .env file');
  import('dotenv').then(dotenv => dotenv.config({ path: envPath }));
}

async function createServer() {
  const app = express();
  const PORT = process.env.PORT || 5000;
  
  // Enable CORS
  app.use(cors());

  // Log all requests
  app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Define client routes
  const CLIENT_ROUTES = [
    '/',
    '/login',
    '/register',
    '/dashboard',
    '/mood-tracker',
    '/hug-center',
    '/profile',
    '/about'
  ];

  // Set up API proxy
  const apiUrl = process.env.VITE_BACKEND_URL || 'http://localhost:3000';
  console.log(`Proxying API requests to: ${apiUrl}`);

  // Set up proxies for API calls before the history API fallback
  app.use('/api', createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    pathRewrite: {
      '^/api': '' // remove /api prefix when forwarding to target
    },
    onError: (err, req, res) => {
      console.error('API Proxy error:', err.message);
      res.status(500).send('API Proxy Error');
    }
  }));

  app.use('/graphql', createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('GraphQL Proxy error:', err.message);
      res.status(500).send('GraphQL Proxy Error');
    }
  }));

  app.use('/info', createProxyMiddleware({
    target: apiUrl,
    changeOrigin: true,
    onError: (err, req, res) => {
      console.error('Info Proxy error:', err.message);
      res.status(500).send('Info Proxy Error');
    }
  }));

  // Apply history API fallback for client-side routing
  app.use(history({
    verbose: true,
    rewrites: [
      // Don't rewrite API requests
      { 
        from: /^\/(api|graphql|info|assets)\/.*$/,
        to: context => context.parsedUrl.pathname
      },
      // For client routes, serve index.html
      { 
        from: new RegExp(`^(${CLIENT_ROUTES.join('|')})($|/|\\?)`),
        to: '/index.html' 
      },
      // For everything else, serve index.html (catch-all for SPA)
      { 
        from: /^\/.*$/,
        to: '/index.html'
      }
    ]
  }));

  // Create Vite server in middleware mode
  const vite = await createViteServer({
    server: { 
      middlewareMode: true,
      hmr: {
        clientPort: process.env.REPLIT_SLUG || process.env.REPL_ID ? 443 : undefined,
        host: process.env.REPLIT_SLUG || process.env.REPL_ID ? 'www.replit.com' : undefined,
      }
    },
    appType: 'custom'
  });

  // Use vite's connect instance as middleware
  app.use(vite.middlewares);

  // Serve static files from the public directory
  app.use(express.static(path.join(__dirname, 'public')));

  // Fallback handler for any remaining routes
  app.use('*', async (req, res) => {
    try {
      const indexPath = path.resolve(__dirname, 'index.html');
      let html = fs.readFileSync(indexPath, 'utf-8');
      
      // Apply Vite HTML transforms
      html = await vite.transformIndexHtml(req.originalUrl, html);
      
      res.status(200).set({ 'Content-Type': 'text/html' }).end(html);
    } catch (e) {
      console.error('Error processing request:', e);
      vite.ssrFixStacktrace(e);
      res.status(500).end('Internal Server Error');
    }
  });

  // Start the server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HugMeNow React app running at http://0.0.0.0:${PORT}`);
    console.log(`API proxied to: ${apiUrl}`);
    console.log(`Client routes: ${CLIENT_ROUTES.join(', ')}`);
  });
}

createServer();