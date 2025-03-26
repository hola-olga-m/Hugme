// Simple Express server for serving the React application
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Add logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Set up API proxies
const apiUrl = process.env.VITE_BACKEND_URL || 'http://localhost:3000';
console.log(`API server URL: ${apiUrl}`);

// Set up API proxy middleware
app.use('/api', createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // remove /api prefix when forwarding to target
  }
}));

app.use('/graphql', createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true
}));

app.use('/info', createProxyMiddleware({
  target: apiUrl,
  changeOrigin: true
}));

// Serve static files first
app.use(express.static(path.join(__dirname, 'public')));

// Use history API fallback for SPA client-side routing
app.use(history({
  verbose: true
}));

// Then serve static files again (after the history middleware)
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
  console.log(`API proxied to: ${apiUrl}`);
});