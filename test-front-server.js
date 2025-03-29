/**
 * Minimal Express server for testing
 */

import express from 'express';
import path from 'path';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Proxy API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true
}));

// Proxy GraphQL requests
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true
}));

// Serve static files from the web directory
app.use(express.static(path.join(__dirname, 'hugmenow/web/dist')));

// For all other routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'hugmenow/web/dist/index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${PORT}`);
});