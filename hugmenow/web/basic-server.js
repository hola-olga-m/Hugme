// Basic Express server with minimal configuration for Replit
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = 5000; // Replit expects your app to listen on port 5000

// Add headers for Replit compatibility
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Log all requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url} (${req.headers['user-agent'] || 'no-user-agent'})`);
  next();
});

// Health check route
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Fallback route - serve index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create server
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HugMeNow server running on http://0.0.0.0:${PORT}`);
  console.log(`For local development, access via http://localhost:${PORT}`);
  console.log(`For Replit, access via the WebView tab or your Replit URL`);
});