/**
 * Simple Express server for serving the built React application
 * and proxying API requests to the backend server
 */

import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';
import { fileURLToPath } from 'url';

// Get the current file URL
const __filename = fileURLToPath(import.meta.url);
// Get the directory name
const __dirname = path.dirname(__filename);

// Get port from environment variable or use default
const PORT = process.env.PORT || 5000;
const API_URL = process.env.API_URL || 'http://localhost:3003';

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Configure API proxy
const apiProxy = createProxyMiddleware({
  target: API_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/'
  },
  logLevel: 'silent'
});

// Apply proxy middleware
app.use('/api', apiProxy);
app.use('/graphql', createProxyMiddleware({ target: API_URL, changeOrigin: true }));

// Log production mode
console.log('Production mode detected - serving from dist directory');

// Serve static files from the React app's build directory
app.use(express.static(path.join(__dirname, 'dist')));
app.use(express.static(path.join(__dirname, 'public')));

// All remaining requests return the React app, so it can handle routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on port ${PORT} (0.0.0.0)`);
  console.log(`- Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`- API proxy to: ${API_URL}`);
  // Log additional information to help with troubleshooting
  console.log(`- Main application URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  console.log(`- Test page URL: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/test.html`);
});
