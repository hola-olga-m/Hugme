// minimal-server.js - An ultra-minimal server for testing workflow detection
import http from 'http';

// Try a different port to see if it's a port-specific issue
const PORT = 3001;

// Create a very basic HTTP server
const server = http.createServer((req, res) => {
  // Set CORS headers for all responses
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS requests (preflight)
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Log all requests
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);

  // Handle specific routes
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      port: PORT, 
      time: new Date().toISOString()
    }));
  } else if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>HugMeNow Minimal Server</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
            .message { margin: 20px; padding: 20px; background-color: #f7f7f7; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>HugMeNow Minimal Server</h1>
          <div class="message">
            <p>This is a minimal HTTP server for testing workflow detection.</p>
            <p>Current time: ${new Date().toISOString()}</p>
            <p>Server port: ${PORT}</p>
            <p><a href="/health">Check health endpoint</a></p>
          </div>
        </body>
      </html>
    `);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

// Start the server
console.log('****************************************************');
console.log(`* Starting MINIMAL HTTP server on port ${PORT}...  *`);
console.log('****************************************************');

server.listen(PORT, '0.0.0.0', () => {
  console.log(`MINIMAL SERVER RUNNING ON PORT ${PORT}`);
  console.log(`Server time: ${new Date().toISOString()}`);
  
  // Print all listening addresses
  const addressInfo = server.address();
  console.log('Server address info:', addressInfo);
  
  // Print key pieces of information in a clearly visible format
  console.log('');
  console.log('===========================================');
  console.log('=== MINIMAL SERVER IS READY TO CONNECT ===');
  console.log(`=== SERVER LISTENING ON PORT ${PORT}      ===`);
  console.log(`=== URL: http://0.0.0.0:${PORT}           ===`);
  console.log('===========================================');
  console.log('');
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error occurred:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
});