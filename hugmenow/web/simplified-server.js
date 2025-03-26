import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.originalUrl}`);
  next();
});

// Basic status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HugMeNow Frontend',
    timestamp: new Date().toISOString()
  });
});

// Proxy API requests to the NestJS server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/' // rewrite path
  },
  logLevel: 'debug'
}));

// Proxy GraphQL requests to the NestJS server
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'debug'
}));

// Check if dist directory exists
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`[ERROR] Production build not found at ${distPath}`);
  process.exit(1);
}

// Serve the index.html from dist directory for root path
app.get('/', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  console.log(`[ROOT] Serving index.html from: ${indexPath}`);
  return res.sendFile(indexPath);
});

// Serve static files from the dist directory with enhanced logging for debugging
app.use(express.static(distPath, {
  etag: true,
  index: false, // Don't automatically serve index.html
  setHeaders: (res, filepath) => {
    // For main JS and CSS files, set caching and log access
    if (filepath.endsWith('.js') || filepath.endsWith('.css')) {
      console.log(`[STATIC] Serving asset: ${filepath}`);
      res.setHeader('Cache-Control', 'max-age=31536000, immutable');
    }
  }
}));

// Serve static files from public directory as fallback (but only for files not in dist)
app.use((req, res, next) => {
  // Skip if the file is found in dist
  const distFilePath = path.join(distPath, req.path);
  if (fs.existsSync(distFilePath)) {
    return next();
  }
  
  // Otherwise serve from public
  const publicFilePath = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(publicFilePath)) {
    console.log(`[PUBLIC] Serving from public dir: ${publicFilePath}`);
    return res.sendFile(publicFilePath);
  }
  
  // Continue routing
  next();
});

// For routes that should be handled by the React Router
app.get('*', (req, res) => {
  // Skip API and GraphQL routes
  if (req.path.startsWith('/api') || req.path.startsWith('/graphql') || req.path === '/status') {
    return; // These would have been handled by the proxy middleware
  }

  // Check if requesting a file (has extension)
  if (req.path.includes('.') && !req.path.endsWith('.html')) {
    // Try to find the file in the dist directory
    const filePath = path.join(distPath, req.path);
    console.log(`[FILE] Looking for: ${filePath}`);
    
    if (fs.existsSync(filePath)) {
      console.log(`[FILE] Found: ${filePath}`);
      return res.sendFile(filePath);
    }
    
    // Try assets directory
    const assetPath = path.join(distPath, 'assets', path.basename(req.path));
    if (fs.existsSync(assetPath)) {
      console.log(`[FILE] Found in assets: ${assetPath}`);
      return res.sendFile(assetPath);
    }
    
    console.log(`[ERROR] File not found: ${req.path}`);
    return res.status(404).send(`File not found: ${req.path}`);
  }
  
  // For all other routes, serve index.html
  console.log(`[ROUTE] Serving index.html for: ${req.path}`);
  res.sendFile(path.join(distPath, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] Running on port ${PORT}`);
  console.log(`[SERVER] Serving from: ${distPath}`);
  console.log(`[SERVER] API proxy to: http://localhost:3000`);
});