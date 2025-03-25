// simple-server.js - A very basic HTTP server specifically optimized for Replit
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory name properly in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      time: new Date().toISOString()
    }));
  }
  
  // Always serve the same HTML for any other route
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HugMeNow</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            text-align: center;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            background-color: #f5f5f5;
          }
          .container {
            max-width: 800px;
            padding: 20px;
          }
          h1 {
            color: #4a6fa5;
            margin-bottom: 10px;
          }
          .card {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            margin: 20px 0;
            width: 100%;
          }
          .status {
            display: inline-block;
            background-color: #47b475;
            color: white;
            padding: 5px 10px;
            border-radius: 4px;
            font-weight: bold;
          }
          .features {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
          }
          .feature {
            background-color: #e9f0f8;
            padding: 10px;
            border-radius: 4px;
            width: 150px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>HugMeNow Web App</h1>
          <div class="card">
            <span class="status">Server Online</span>
            <h3>Welcome to HugMeNow!</h3>
            <p>Your emotional wellness and support platform</p>
            <p>Server time: ${new Date().toISOString()}</p>
          </div>
          
          <div class="card">
            <h3>Coming Soon Features</h3>
            <div class="features">
              <div class="feature">Mood Tracking</div>
              <div class="feature">Virtual Hugs</div>
              <div class="feature">Community Support</div>
              <div class="feature">Wellness Tips</div>
              <div class="feature">Personal Analytics</div>
              <div class="feature">Journal Entries</div>
            </div>
          </div>
        </div>
        <script>
          console.log('HugMeNow simple server page loaded');
          // Add a message to show the page has loaded
          window.onload = function() {
            console.log('Page fully loaded at: ' + new Date().toISOString());
          };
        </script>
      </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Ready to receive connections`);
});

// Keep the process alive and log heartbeats
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 10000);