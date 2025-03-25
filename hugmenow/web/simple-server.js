// simple-server.js - A minimal server for HugMeNow frontend
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 5000;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  
  // Serve HTML for root path
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    return res.end(`
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
            height: 100vh;
            margin: 0;
            padding: 20px;
            text-align: center;
            background-color: #f5f8ff;
            color: #333;
          }
          .container {
            max-width: 500px;
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
            font-size: 2.5rem;
            margin-bottom: 10px;
            color: #4a62b3;
          }
          p {
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .button {
            background-color: #4a62b3;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-size: 1rem;
            cursor: pointer;
            transition: background-color 0.3s;
            margin: 5px;
          }
          .button:hover {
            background-color: #3a4f9a;
          }
          .status {
            margin-top: 30px;
            font-size: 0.9rem;
            color: #666;
            border-top: 1px solid #eee;
            padding-top: 15px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="logo">🤗</div>
          <h1>HugMeNow</h1>
          <p>The emotional wellness platform that connects people through virtual support and mood tracking.</p>
          <p>Our infrastructure is ready! Choose what to develop next:</p>
          <div>
            <button class="button" onclick="alert('Coming soon!')">Login / Register</button>
            <button class="button" onclick="alert('Coming soon!')">Mood Tracker</button>
            <button class="button" onclick="alert('Coming soon!')">Send a Hug</button>
          </div>
          <div class="status">
            <p>Frontend Server: Running on port ${PORT}</p>
            <p>Backend Server: Running on port 3002</p>
            <p>Server Time: ${new Date().toISOString()}</p>
          </div>
        </div>
        <script>
          console.log("HugMeNow simple server page loaded");
          console.log("Page fully loaded at: " + new Date().toISOString());
        </script>
      </body>
      </html>
    `);
  }
  
  // Fallback for all other routes
  res.writeHead(404, { 'Content-Type': 'text/plain' });
  res.end('Not Found');
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Ready to receive connections`);
});

// Send heartbeat logs periodically
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 10000);

// Handle errors
server.on('error', (err) => {
  console.error('Server error:', err);
});