/**
 * Highly simplified server specifically for Replit's web application feedback tool
 * This is the most basic implementation possible that should work with the tool
 */

import http from 'http';

// Create a very basic HTTP server
const server = http.createServer((req, res) => {
  // Log complete request details for debugging
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // Respond to OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Respond with simple HTML page
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Replit Feedback Test</title>
        <style>
          body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
          h1 { color: #4B32C3; }
          .success { color: green; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Replit Feedback Test</h1>
        <p class="success">✅ Server is responding correctly!</p>
        <p>This minimal page is designed to test connectivity with Replit's web application feedback tool.</p>
        <p>Current time: ${new Date().toLocaleString()}</p>
        <p>Your request was: ${req.method} ${req.url}</p>
        <hr>
        <p>This page should be visible in the web application feedback tool if configured correctly.</p>
      </body>
    </html>
  `);
});

// Start server on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('Ultra simple server running on http://0.0.0.0:5000');
  console.log('Ready for the web application feedback tool');
});