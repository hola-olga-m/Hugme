/**
 * Highly simplified server specifically for Replit's web application feedback tool
 * This is the most basic implementation possible that should work with the tool
 */

import http from 'http';

// Create a basic HTTP server
const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  
  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Set content type to HTML
  res.setHeader('Content-Type', 'text/html');
  
  // Send a simple HTML response
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Replit Feedback Test</title>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
          h1 { color: #2B65EC; }
          .success { background-color: #d4edda; border-radius: 8px; padding: 15px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <h1>Server is responding correctly!</h1>
        <div class="success">
          <p>This page is being served by a simple HTTP server on port 5000.</p>
          <p>It should be visible in Replit's web application feedback tool.</p>
        </div>
        <div>
          <p>Request received: ${req.method} ${req.url}</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      </body>
    </html>
  `);
});

// Listen on port 5000 and bind to all network interfaces
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('Ready for testing with Replit\'s web application feedback tool');
});