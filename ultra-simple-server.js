/**
 * Ultra simplified HTTP server specifically for Replit's web application feedback tool
 * Using Node.js built-in HTTP module without Express or any dependencies
 */

import http from 'http';

// Create the simplest possible HTTP server
const server = http.createServer((req, res) => {
  // Log the request
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Set headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Send a minimal HTML response
  res.writeHead(200);
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Ultra Simple Server</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body style="font-family: sans-serif; text-align: center; margin-top: 50px;">
        <h1>Ultra Simple Server is Running!</h1>
        <p>This is a minimal HTTP server created specifically for testing the Replit web application feedback tool.</p>
        <p>If you can see this page, the server is working correctly.</p>
        <div style="margin: 20px; padding: 15px; background-color: #d1e7dd; border-radius: 5px;">
          <p>Request: ${req.method} ${req.url}</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `);
});

// Listen on port 5000
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Ultra simple server running on http://0.0.0.0:${PORT}`);
  console.log('Ready for testing with the web application feedback tool');
});