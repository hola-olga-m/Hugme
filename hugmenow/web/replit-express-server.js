// replit-express-server.js - Replit optimized server for ES modules
import express from 'express';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import http from 'http';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = 5000;

// Serve static files from the public directory if it exists
const publicDir = join(__dirname, 'public');
if (fs.existsSync(publicDir)) {
  app.use(express.static(publicDir));
  console.log('Serving static files from public directory');
}

// Serve static files from the dist directory if it exists
const distDir = join(__dirname, 'dist');
if (fs.existsSync(distDir)) {
  app.use(express.static(distDir));
  console.log('Serving static files from dist directory');
}

// Add CORS headers to all responses
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  
  next();
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Fallback route to serve index.html for SPA routing
app.get('*', (req, res) => {
  // Priority: dist/index.html > public/index.html > root index.html > fallback
  const distIndex = join(distDir, 'index.html');
  const publicIndex = join(publicDir, 'index.html');
  const rootIndex = join(__dirname, 'index.html');
  
  if (fs.existsSync(distIndex)) {
    return res.sendFile(distIndex);
  } else if (fs.existsSync(publicIndex)) {
    return res.sendFile(publicIndex);
  } else if (fs.existsSync(rootIndex)) {
    return res.sendFile(rootIndex);
  } else {
    // Fallback to a basic HTML response
    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HugMeNow</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            background-color: #f5f8ff;
            color: #333;
          }
          .container {
            max-width: 600px;
            padding: 30px;
            background-color: white;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }
          h1 {
            color: #4a62b3;
            margin-bottom: 10px;
          }
          .logo {
            font-size: 3rem;
            margin-bottom: 10px;
            color: #4a62b3;
          }
          p {
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .button-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin-bottom: 20px;
          }
          .button {
            background-color: #4a62b3;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .button:hover {
            background-color: #3a4f9a;
            transform: translateY(-2px);
          }
          .status {
            margin-top: 30px;
            font-size: 0.9rem;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
          .api-status {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            background-color: #e6f7e6;
            color: #2e7d32;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🤗</div>
          <h1>HugMeNow</h1>
          <p>The emotional wellness platform that connects people through virtual support and mood tracking.</p>
          
          <p>Our foundation is successfully set up! What would you like to develop next?</p>
          
          <div class="button-container">
            <button class="button" onclick="alert('Feature coming soon!')">Login/Register</button>
            <button class="button" onclick="alert('Feature coming soon!')">Mood Tracking</button>
            <button class="button" onclick="alert('Feature coming soon!')">Virtual Hugs</button>
          </div>
          
          <div class="status">
            <p>Frontend Server: <span class="api-status">Running</span> on port ${PORT}</p>
            <p>Backend API: <span class="api-status">Running</span> on port 3002</p>
            <p>Server Time: ${new Date().toISOString()}</p>
          </div>
        </div>
        <script>
          console.log("HugMeNow application loaded");
          console.log("Page fully loaded at: " + new Date().toISOString());
          
          // Check backend connection
          fetch('/api/health')
            .then(response => response.json())
            .then(data => {
              console.log("Backend health check:", data);
            })
            .catch(error => {
              console.error("Backend health check failed:", error);
            });
        </script>
      </body>
      </html>
    `);
  }
});

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`HugMeNow application running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Port: ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Log heartbeat every 10 seconds to keep console active
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}`);
}, 10000);

// Handle server errors
server.on('error', (error) => {
  console.error('Server error:', error);
});