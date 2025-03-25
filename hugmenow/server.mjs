// Next.js server for HugMeNow - ESM version
import express from 'express';
import { createServer } from 'http';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import next from 'next';

// ESM equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Determine if we're in development mode
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const PORT = 5000;

// Initialize Next.js app
app.prepare().then(() => {
  const server = express();

  // Middleware for request logging
  server.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // CORS middleware
  server.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(204);
    }
    next();
  });

  // Parse JSON request bodies
  server.use(express.json());

  // Serve static files from web/public if available
  try {
    const publicPath = join(__dirname, 'web/public');
    server.use('/static', express.static(publicPath));
    console.log(`Serving static files from: ${publicPath}`);
  } catch (error) {
    console.log('No public directory found or error accessing it:', error.message);
  }

  // API Routes
  server.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      service: 'HugMeNow API'
    });
  });

  server.get('/api/info', (req, res) => {
    res.json({
      name: 'HugMeNow API',
      version: '0.1.0',
      description: 'Emotional wellness platform API',
      endpoints: {
        '/api/health': 'Health check endpoint',
        '/api/info': 'API information',
        '/api/users': 'User management (coming soon)',
        '/api/moods': 'Mood tracking (coming soon)',
        '/api/hugs': 'Virtual hugs (coming soon)'
      }
    });
  });

  // Let Next.js handle all other routes
  server.all('*', (req, res) => {
    return handle(req, res);
  });

  // Start server
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`HugMeNow Next.js server running on http://0.0.0.0:${PORT}`);
    console.log(`Server started at: ${new Date().toISOString()}`);
  });

  // Log heartbeat periodically
  setInterval(() => {
    console.log(`Server heartbeat at ${new Date().toISOString()}`);
  }, 30000);
}).catch(err => {
  console.error('Error starting Next.js app:', err);
});