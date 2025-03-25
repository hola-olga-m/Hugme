// Simple Express server for HugMeNow - Replit optimized version
const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware for request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
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

// Parse JSON request bodies
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HugMeNow API'
  });
});

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
        .api-test {
          margin-top: 20px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 8px;
          text-align: left;
        }
        .api-response {
          font-family: monospace;
          white-space: pre;
          overflow-x: auto;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🤗</div>
        <h1>HugMeNow</h1>
        <p>Your emotional wellness platform for virtual support, mood tracking, and connecting with others.</p>
        
        <div class="buttons">
          <button class="button" onclick="alert('Feature coming soon!')">Login</button>
          <button class="button" onclick="alert('Feature coming soon!')">Mood Tracker</button>
          <button class="button" onclick="alert('Feature coming soon!')">Send a Hug</button>
        </div>
        
        <div class="status">
          <p><strong>Server:</strong> Running on port ${PORT}</p>
          <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
          <p><strong>Status:</strong> Online and working</p>
        </div>
        
        <div class="api-test">
          <h3>API Status</h3>
          <div class="api-response" id="api-response">Loading API status...</div>
        </div>
      </div>
      
      <script>
        console.log("HugMeNow app loaded");
        
        // Test API endpoint
        fetch('/api/health')
          .then(response => response.json())
          .then(data => {
            document.getElementById('api-response').textContent = JSON.stringify(data, null, 2);
            console.log("API health check:", data);
          })
          .catch(error => {
            document.getElementById('api-response').textContent = "Error connecting to API: " + error.message;
            console.error("API connection error:", error);
          });
      </script>
    </body>
    </html>
  `);
});

// Catch-all route for any undefined routes
app.get('*', (req, res) => {
  res.redirect('/');
});

// Special handling for Replit's periodic health checks
// Explicitly mark when the server is ready for connections
let serverReady = false;

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`HugMeNow Express server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  
  // Mark server as ready after a brief delay to ensure full initialization
  setTimeout(() => {
    serverReady = true;
    console.log(`Server marked as ready at: ${new Date().toISOString()}`);
  }, 500);
});

// Set a large timeout (10 minutes) to prevent premature connection closing
server.timeout = 600000;

// Ensure process exits properly on termination signals
process.on('SIGINT', () => {
  console.log('Server shutting down...');
  server.close(() => {
    console.log('Server terminated');
    process.exit(0);
  });
});

// Log periodic heartbeats for monitoring
setInterval(() => {
  if (serverReady) {
    console.log(`Server heartbeat at ${new Date().toISOString()}`);
  }
}, 10000);