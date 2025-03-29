/**
 * Ultra simplified HTTP server specifically for Replit's web application feedback tool
 * Using Node.js built-in HTTP module without Express or any dependencies
 */

import http from 'http';
import fs from 'fs';

// Variables to store server statistics
const serverStartTime = new Date().toISOString();
let requestCount = 0;
const requestLog = [];

// Create a server with the HTTP module
const server = http.createServer((req, res) => {
  // Log request details
  const timestamp = new Date().toISOString();
  const requestInfo = {
    timestamp,
    method: req.method,
    url: req.url,
    headers: req.headers,
    remoteAddress: req.socket.remoteAddress
  };
  
  requestCount++;
  requestLog.push(requestInfo);
  
  // Log to console
  console.log(`[${timestamp}] ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  
  // Write to log file (append)
  fs.appendFileSync('server_requests.log', 
    `${timestamp} - ${req.method} ${req.url} from ${req.socket.remoteAddress}\n` +
    `Headers: ${JSON.stringify(req.headers)}\n\n`
  );

  // Set headers
  res.writeHead(200, {'Content-Type': 'text/html'});
  
  // Determine if this is a status request
  if (req.url === '/status') {
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Server Status</title>
        </head>
        <body>
          <h1>Server Status</h1>
          <p>Server is running</p>
          <p>Started at: ${serverStartTime}</p>
          <p>Request count: ${requestCount}</p>
          <h2>Recent Requests</h2>
          <pre>${JSON.stringify(requestLog, null, 2)}</pre>
        </body>
      </html>
    `);
    return;
  }
  
  // Send a simple HTML response for standard requests
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ultra Simple Server</title>
        <style>
          body { 
            font-family: sans-serif;
            margin: 20px;
            text-align: center;
          }
          h1 { color: #0066cc; }
        </style>
      </head>
      <body>
        <h1>Ultra Simple Server</h1>
        <p>This server is running directly on port 5000 using Node's built-in HTTP module</p>
        <p>Current time: ${new Date().toISOString()}</p>
        <p>Server started at: ${serverStartTime}</p>
        <p>Total requests received: ${requestCount}</p>
        <p><a href="/status">View Server Status</a></p>
      </body>
    </html>
  `);
});

// Start the server
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ultra simple server running at http://0.0.0.0:${PORT}`);
  console.log(`Server start time: ${serverStartTime}`);
});