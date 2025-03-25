// static-file-server.js - A server focused on serving the built React app
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory where this script is located
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup Express
const app = express();
const PORT = 3001; // Use a fixed port for consistency

// Path to the build directory
const distDir = join(__dirname, 'dist');
const publicDir = join(__dirname, 'public');

// Check if dist directory exists, create it if needed
if (!fs.existsSync(distDir)) {
  console.log('Creating dist directory as it does not exist');
  fs.mkdirSync(distDir, { recursive: true });
  fs.writeFileSync(join(distDir, 'index.html'), `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>HugMeNow</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .message { margin: 20px; padding: 20px; background-color: #f7f7f7; border-radius: 5px; }
        </style>
      </head>
      <body>
        <h1>HugMeNow Web App</h1>
        <div class="message">
          <p>This is a placeholder for the HugMeNow web application.</p>
          <p>The React build has not been generated yet.</p>
          <p>Run 'npm run build' to generate the production build.</p>
        </div>
      </body>
    </html>
  `);
}

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    port: PORT, 
    time: new Date().toISOString(),
    message: 'Static file server is running!'
  });
});

// Setup API proxy to NestJS
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding
  },
}));

// Proxy GraphQL requests to NestJS
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3002',
  changeOrigin: true,
}));

// Serve static files from the build directory with proper caching headers
console.log(`Serving static files from ${distDir}`);
app.use(express.static(distDir, {
  etag: true,
  lastModified: true,
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      // Don't cache HTML files
      res.setHeader('Cache-Control', 'no-cache');
    } else if (path.match(/\.(js|css|png|jpg|jpeg|gif|ico|svg)$/)) {
      // Cache for 1 week
      res.setHeader('Cache-Control', 'public, max-age=604800');
    }
  }
}));

// Serve static files from the public directory
console.log(`Serving static files from ${publicDir}`);
app.use(express.static(publicDir));

// For any other request, send the index.html file
app.get('*', (req, res) => {
  res.sendFile(join(distDir, 'index.html'));
});

// Start server with more detailed logging
console.log('*****************************************************');
console.log(`* Starting static file server on port ${PORT}...    *`);
console.log(`* Binding to ALL interfaces (0.0.0.0)               *`);
console.log('*****************************************************');

// Create server and save reference for error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log('### SERVER LISTENING ON PORT', PORT, '###');
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('API proxy configured to: http://localhost:3002');
  console.log('Available routes:');
  console.log('- / (SPA frontend)');
  console.log('- /api/* (API proxy)');
  console.log('- /graphql (GraphQL proxy)');
  console.log('- /health (Health check endpoint)');
  console.log('Server is ready to accept connections!');
  console.log(`Server confirmed to be listening on port ${PORT}`);
  
  // Extra debugging information for Replit detection
  console.log('DEBUG: Environment variables:');
  console.log(`PORT: ${process.env.PORT}`);
  console.log(`REPL_ID: ${process.env.REPL_ID}`);
  console.log(`REPL_OWNER: ${process.env.REPL_OWNER}`);
  console.log(`REPL_SLUG: ${process.env.REPL_SLUG}`);
  
  // Verify server properties
  console.log(`Server listening: ${server.listening}`);
  
  // Print all listening addresses
  const addressInfo = server.address();
  console.log('Server address info:', addressInfo);
  
  // Send explicit ready signals for Replit
  if (process.send) {
    console.log('Sending ready signal to parent process');
    process.send('ready');
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error occurred:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
});