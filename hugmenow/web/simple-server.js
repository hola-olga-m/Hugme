import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Add a ping/health check endpoint
app.get('/ping', (req, res) => {
  console.log('Health check ping received');
  res.status(200).json({ status: 'ok', message: 'HugMeNow frontend server is running' });
});

// Setup API proxy
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  // Don't rewrite the path for API calls
  pathRewrite: {
    '^/api': '/', // rewrite path back to root for the API server
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying API request: ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).json({
      error: 'Proxy error',
      message: err.message
    });
  }
}));

// Setup GraphQL proxy
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying GraphQL request: ${req.method} ${req.url} -> ${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('GraphQL proxy error:', err);
    res.status(500).json({
      error: 'GraphQL proxy error',
      message: err.message
    });
  }
}));

// Serve static files from dist directory
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath, {
  setHeaders: (res, path) => {
    // For PNG files in icons directory
    if (path.includes('icons/png') && path.endsWith('.png')) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Content-Type', 'image/png');
    }
    // For JS, CSS assets (contains hash in filename)
    else if (path.endsWith('.js') || path.endsWith('.css')) {
      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
    } else {
      // For non-hashed assets
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// Special route for PNG icons to ensure they're found
app.get('/assets/icons/png/:filename', (req, res) => {
  const iconPath = path.join(distPath, 'assets', 'icons', 'png', req.params.filename);
  
  if (fs.existsSync(iconPath)) {
    console.log(`Serving PNG icon: ${req.params.filename}`);
    res.setHeader('Content-Type', 'image/png');
    res.sendFile(iconPath);
  } else {
    console.error(`PNG icon not found: ${req.params.filename}`);
    res.status(404).send('Icon not found');
  }
});

// Serve index.html for all routes (SPA)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  // Check if index.html exists
  if (fs.existsSync(indexPath)) {
    console.log(`Serving index.html for route: ${req.path}`);
    res.sendFile(indexPath);
  } else {
    res.status(404).send('Not found - Build the application first with npm run build');
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`Serving files from ${distPath}`);
});