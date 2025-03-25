import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create a simple fallback HTML content in case the build files are missing
const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HugMeNow - Emotional Wellness Platform</title>
  <style>
    body { font-family: 'Arial', sans-serif; line-height: 1.6; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f8f9fa; }
    .container { max-width: 800px; margin: 0 auto; padding: 2rem; text-align: center; }
    .card { background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); padding: 2rem; margin-bottom: 2rem; }
    h1 { color: #4a90e2; margin-bottom: 1rem; }
    .spinner { border: 4px solid rgba(0, 0, 0, 0.1); border-radius: 50%; border-top: 4px solid #4a90e2; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 1rem auto; }
    @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>HugMeNow</h1>
      <p>Emotional Wellness Platform</p>
      <div class="spinner"></div>
      <p>Loading application...</p>
    </div>
  </div>
</body>
</html>`;

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

// Add a simple health check route (before any middleware) to make port detection easier
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Add logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Configure API and GraphQL proxies
const createProxy = (target, pathRewrite = {}) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  logLevel: 'error',
  onError: (err, req, res) => {
    console.error(`Proxy Error (${req.url}):`, err.message);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Backend server unavailable', error: err.message }));
  }
});

// Apply proxies before history middleware
app.use('/api', createProxyMiddleware(createProxy(API_HOST, { '^/api': '' })));
app.use('/graphql', createProxyMiddleware(createProxy(API_HOST)));
app.use('/info', createProxyMiddleware(createProxy(API_HOST)));

// Add another health check route that won't be rewritten
app.get('/health-check', (req, res) => {
  res.status(200).json({ status: 'ok', port: PORT, time: new Date().toISOString() });
});

// Apply history API fallback middleware for SPA routing
app.use(history({
  verbose: true,
  disableDotRule: true,
  rewrites: [
    // Don't rewrite API requests or health checks
    { from: /^\/(api|graphql|info|assets|health|health-check)\/.*$/, to: context => context.parsedUrl.pathname }
  ]
}));

// Paths to serve static content from
const distPath = join(__dirname, 'dist');
const publicPath = join(__dirname, 'public');
const projectRoot = __dirname;

// Function to ensure the dist directory exists
const ensureDistDirectory = () => {
  // Create dist directory if it doesn't exist
  if (!fs.existsSync(distPath)) {
    try {
      fs.mkdirSync(distPath, { recursive: true });
      console.log(`Created missing dist directory at: ${distPath}`);
      
      // Create a minimal index.html in the dist directory
      fs.writeFileSync(join(distPath, 'index.html'), fallbackHtml);
      console.log('Created fallback index.html in dist directory');
      
      // Create a _redirects file for SPA routing
      fs.writeFileSync(join(distPath, '_redirects'), '/* /index.html 200');
      console.log('Created _redirects in dist directory');
      
      return true;
    } catch (err) {
      console.error('Error creating dist directory:', err);
      return false;
    }
  }
  return true;
};

// Ensure the dist directory exists before proceeding
const distExists = ensureDistDirectory();

// Serve static files with appropriate caching headers
const serveStaticWithCaching = (path, cacheOptions = {}) => {
  return express.static(path, {
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        // No caching for HTML files
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      } else if (filePath.match(/\.(js|css)$/)) {
        // Medium caching for JS and CSS (10 minutes)
        res.setHeader('Cache-Control', 'public, max-age=600');
      } else if (filePath.match(/\.(jpg|jpeg|png|gif|ico|svg|webp)$/)) {
        // Longer caching for images (1 day)
        res.setHeader('Cache-Control', 'public, max-age=86400');
      }
      
      // Apply any custom headers from options
      if (cacheOptions.headers) {
        Object.entries(cacheOptions.headers).forEach(([key, value]) => {
          res.setHeader(key, value);
        });
      }
    }
  });
};

// Serve static files from dist directory
if (distExists && fs.existsSync(distPath)) {
  app.use(serveStaticWithCaching(distPath));
  console.log(`Serving static files from ${distPath}`);
  
  // If there's a public directory, serve those too
  if (fs.existsSync(publicPath)) {
    app.use(serveStaticWithCaching(publicPath));
    console.log(`Serving static files from ${publicPath}`);
  }
} else {
  console.warn('Warning: Problem with dist directory. Serving only index.html fallback.');
}

// Fallback route handler for the SPA
app.get('*', (req, res) => {
  const indexHtmlPath = join(distPath, 'index.html');
  const rootIndexHtmlPath = join(projectRoot, 'index.html');
  
  if (fs.existsSync(indexHtmlPath)) {
    res.sendFile(indexHtmlPath);
  } else if (fs.existsSync(rootIndexHtmlPath)) {
    res.sendFile(rootIndexHtmlPath);
  } else {
    // If no index.html files are found, send the fallback HTML
    res.send(fallbackHtml);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke on the server!');
});

// Add a dedicated health check endpoint for Replit workflow
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    port: PORT, 
    time: new Date().toISOString(),
    workflow: 'React Frontend',
    hasReactApp: true
  });
});

// Explicitly print a message that will help workflow detection
console.log(`Starting server on port ${PORT}...`);
console.log(`Server will listen on http://0.0.0.0:${PORT}`);
console.log(`Health check available at http://0.0.0.0:${PORT}/health`);

// Start the server with a connection test to the backend
const server = app.listen(PORT, '0.0.0.0', () => {
  // Explicitly log port information for workflow detection
  console.log(`### SERVER LISTENING ON PORT ${PORT} ###`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API proxy configured to: ${API_HOST}`);
  
  // Log the app structure
  console.log('Available routes:');
  console.log('- / (SPA frontend)');
  console.log('- /api/* (API proxy)');
  console.log('- /graphql (GraphQL proxy)');
  console.log('- /info (App info proxy)');
  
  // Notify that the server is ready
  console.log('Server is ready to accept connections!');
  
  // Additional check to ensure the server is actually listening
  if (server.listening) {
    console.log(`Server confirmed to be listening on port ${PORT}`);
    
    // Create a simple route to confirm server is working
    app.get('/server-status', (req, res) => {
      res.json({ status: 'ok', port: PORT });
    });
  } else {
    console.error(`WARNING: Server reports it is NOT listening on port ${PORT}!`);
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
  
  // If the port is already in use, try a different port
  if (error.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Please use a different port.`);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});