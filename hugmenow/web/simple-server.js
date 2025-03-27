/**
 * Simple Express server for HugMeNow frontend
 * 
 * This server serves the static files and proxies API requests to the NestJS backend
 */

import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import history from 'connect-history-api-fallback';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Check if NestJS server is running on port 3000
const NEST_SERVER_URL = 'http://localhost:3000';

// Set up proxy for API requests
const apiProxy = createProxyMiddleware(['/api', '/graphql', '/login', '/register', '/me', '/users', '/moods', '/hugs'], {
  target: NEST_SERVER_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '', // Remove /api prefix when proxying
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  }
});

// Use history API fallback for SPA routing
app.use(history({
  verbose: true,
  disableDotRule: true,
}));

// First, handle API proxying
app.use('/api', apiProxy);
app.use('/graphql', apiProxy);
app.use('/login', apiProxy);
app.use('/register', apiProxy);
app.use('/me', apiProxy);
app.use('/users', apiProxy);
app.use('/moods', apiProxy);
app.use('/hugs', apiProxy);

// Serve static files
const staticPath = path.join(__dirname, 'dist');
app.use(express.static(staticPath));

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`Serving files from ${staticPath}`);
});