import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create Express server
const app = express();

// Enable CORS for all routes
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Basic logging middleware
app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.url}`);
  next();
});

// Basic status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    server: 'HugMeNow Web Server',
    timestamp: new Date().toISOString()
  });
});

// Check paths
const distPath = path.join(__dirname, 'dist');
if (!fs.existsSync(distPath)) {
  console.error(`[ERROR] Build directory not found: ${distPath}`);
  console.log('[INFO] Trying to create directory...');
  try {
    fs.mkdirSync(distPath, { recursive: true });
    console.log(`[INFO] Created directory: ${distPath}`);
  } catch (err) {
    console.error(`[ERROR] Failed to create directory: ${err.message}`);
  }
}

// Serve static files from dist directory
app.use(express.static(distPath, {
  etag: true,
  maxAge: '1h'
}));

// Proxy API requests to the NestJS server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/' // rewrite path
  }
}));

// Proxy GraphQL requests to the NestJS server
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true
}));

// Create a simple HTML response for the root path
app.get('/', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // If index.html doesn't exist, send a simple HTML
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HugMeNow</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin: 50px; }
          h1 { color: #4a5568; }
          .card { 
            max-width: 600px; 
            margin: 0 auto; 
            padding: 2rem;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            border-radius: 8px;
          }
          .status { margin: 1.5rem 0; padding: 1rem; background-color: #f7fafc; border-radius: 4px; }
          .button {
            display: inline-block;
            background-color: #4299e1;
            color: white;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin: 0.5rem;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <h1>HugMeNow</h1>
          <div class="status">
            <p>Web server is running successfully!</p>
            <p>Time: ${new Date().toISOString()}</p>
          </div>
          <div>
            <a href="/status" class="button">Check Status</a>
            <a href="/api/info" class="button">API Info</a>
          </div>
        </div>
      </body>
    </html>
  `);
});

// For all other routes (React router routes)
app.get('*', (req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  
  // If we can't find index.html, redirect to root
  res.redirect('/');
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`[SERVER] HugMeNow web server running on http://0.0.0.0:${PORT}`);
  console.log(`[SERVER] Serving static files from: ${distPath}`);
  console.log(`[SERVER] API proxy to: http://localhost:3000`);
});