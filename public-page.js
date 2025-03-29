/**
 * Public page server for web application feedback tool
 * Uses Express.js for simplicity and has full logging
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express application
const app = express();

// Serve static files from public directory (if we create one)
app.use(express.static(path.join(__dirname, 'public')));

// Log all requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`${timestamp} ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  next();
});

// Main route - serves a basic HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Public Page</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4B32C3; }
          .card { border-radius: 8px; padding: 16px; margin: 16px 0; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
          .success { background-color: #d4edda; border-color: #c3e6cb; color: #155724; }
        </style>
      </head>
      <body>
        <h1>Public Page</h1>
        <div class="card success">
          <h2>Server Status: Online</h2>
          <p>This page is being served by an Express.js server on port 5000.</p>
          <p>It should be visible in Replit's web application feedback tool.</p>
        </div>
        <div class="card">
          <h2>Request Information</h2>
          <p>Path: ${req.url}</p>
          <p>Method: ${req.method}</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on port ${PORT} (0.0.0.0)`);
  console.log('Server is ready for testing with the web application feedback tool');
});