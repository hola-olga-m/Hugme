// replit-server.js - A minimal server specifically for Replit environment
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

// Get directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Setup Express
const app = express();
const PORT = 5000; // Replit prefers port 5000

// Path to the build directory
const distDir = path.join(__dirname, 'dist');
const publicDir = path.join(__dirname, 'public');

// Log server startup
console.log(`*********************************************************`);
console.log(`* Starting HugMeNow web server on port ${PORT}           *`);
console.log(`* Using dist directory: ${distDir}                       *`);
console.log(`*********************************************************`);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    time: new Date().toISOString(),
    message: 'HugMeNow web server is running'
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

// Serve static files from the dist and public directories
app.use(express.static(distDir));
app.use(express.static(publicDir));

// For any other request, send the index.html file
app.get('*', (req, res) => {
  // Check if index.html exists, if not return a simple HTML
  const indexPath = path.join(distDir, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>HugMeNow</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .message { margin: 20px; padding: 20px; background-color: #f7f7f7; border-radius: 5px; }
            h1 { color: #4a6fa5; }
            .status { color: #47b475; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>HugMeNow Web App</h1>
          <div class="message">
            <p class="status">Server Status: Online</p>
            <p>Basic web server running successfully!</p>
            <p>Timestamp: ${new Date().toISOString()}</p>
          </div>
          <script>
            console.log('HugMeNow static page loaded successfully');
          </script>
        </body>
      </html>
    `);
  }
});

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('API proxy configured to: http://localhost:3002');
  console.log('Ready to accept connections');
  
  // Signal that the server is ready (for Replit)
  if (process.send) {
    console.log('Sending ready signal to parent process');
    process.send('ready');
  }
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error.message);
});

// Log server status periodically to show it's still running
setInterval(() => {
  console.log(`Server health check: running on port ${PORT} at ${new Date().toISOString()}`);
}, 30000);

// Additional debug info
console.log('DEBUG: Server environment details:');
console.log(`Node.js version: ${process.version}`);
console.log(`Process ID: ${process.pid}`);
console.log(`Working directory: ${process.cwd()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});