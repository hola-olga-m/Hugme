import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import history from 'connect-history-api-fallback';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the directory name using ES module approach
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;
const API_HOST = 'http://localhost:3000';

// Configure API proxy for development
const apiProxyConfig = {
  target: API_HOST,
  changeOrigin: true,
  pathRewrite: {
    '^/api': ''
  },
  logLevel: 'debug'
};

// Configure GraphQL proxy for development
const graphqlProxyConfig = {
  target: API_HOST,
  changeOrigin: true,
  logLevel: 'debug'
};

// Apply proxies before history middleware
app.use('/api', createProxyMiddleware(apiProxyConfig));
app.use('/graphql', createProxyMiddleware(graphqlProxyConfig));

// Apply history API fallback to support SPA routing
app.use(history({
  verbose: true,
  disableDotRule: true
}));

// Serve static files from the dist directory
const distPath = join(__dirname, 'dist');

// Check if the dist directory exists
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  console.log(`Serving static files from ${distPath}`);
} else {
  console.warn(`Warning: ${distPath} does not exist. Please build the project first.`);
  console.log('Running in development mode without static files...');
}

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API proxy configured to: ${API_HOST}`);
});