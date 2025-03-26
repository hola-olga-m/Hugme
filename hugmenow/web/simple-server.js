// Simple Express server for serving static files
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors());

// Add request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API server URL
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

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback route - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API proxied to: ${apiUrl}`);
});