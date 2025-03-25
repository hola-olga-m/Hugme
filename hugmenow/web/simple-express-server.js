// simple-express-server.js - Basic Express server for HugMeNow frontend
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Set up __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Express app
const app = express();
const PORT = 5000;

// Middleware for logging
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url} at ${new Date().toISOString()}`);
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Serve static files if available
try {
  const publicPath = join(__dirname, 'public');
  app.use(express.static(publicPath));
  console.log(`Serving static files from: ${publicPath}`);
} catch (error) {
  console.log('No public directory found');
}

// Main route - landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HugMeNow</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background-color: #f7f8fc;
          padding: 20px;
        }
        .container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 40px;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 20px;
        }
        h1 {
          color: #4361ee;
          margin-top: 0;
          margin-bottom: 16px;
        }
        p {
          color: #4f4f4f;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        .button {
          background-color: #4361ee;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .button:hover {
          background-color: #3347b8;
          transform: translateY(-2px);
        }
        .status {
          background-color: #f0f2ff;
          border-radius: 8px;
          padding: 15px;
          font-size: 14px;
          color: #666;
          margin-top: 30px;
        }
        .status p {
          margin: 5px 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🤗</div>
        <h1>HugMeNow</h1>
        <p>Your emotional wellness platform for virtual support, mood tracking, and connecting with others.</p>
        
        <p>The infrastructure is set up and ready for development!</p>
        
        <div class="buttons">
          <button class="button" onclick="alert('Feature coming soon!')">Login</button>
          <button class="button" onclick="alert('Feature coming soon!')">Mood Tracker</button>
          <button class="button" onclick="alert('Feature coming soon!')">Send a Hug</button>
        </div>
        
        <div class="status">
          <p><strong>Frontend Server:</strong> Running on port ${PORT}</p>
          <p><strong>Backend API:</strong> Running on port 3002</p>
          <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
        </div>
      </div>
      
      <script>
        console.log("HugMeNow app loaded");
        console.log("Page loaded at:", new Date().toISOString());
      </script>
    </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    time: new Date().toISOString(),
    service: 'frontend'
  });
});

// API proxy for development convenience
app.get('/api/*', (req, res) => {
  res.json({
    message: 'Frontend proxy to API',
    endpoint: req.path,
    time: new Date().toISOString()
  });
});

// Catch-all route for SPA
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Server is ready to accept connections`);
});

// Log heartbeat periodically
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 10000);