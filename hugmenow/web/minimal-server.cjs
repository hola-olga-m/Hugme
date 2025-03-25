// Minimal server for HugMeNow - CommonJS version for Replit
const http = require('http');
const PORT = 5000;

// Create a simple HTTP server with minimal functionality
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Set basic headers
  res.setHeader('Content-Type', 'text/html');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Send a simple response for all routes
  res.writeHead(200);
  res.end(`
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
        <p>Your emotional wellness platform is online!</p>
        <div class="status">
          <p>Server: Running on port ${PORT}</p>
          <p>Server Time: ${new Date().toISOString()}</p>
        </div>
      </div>
      <script>
        console.log("HugMeNow page loaded at: " + new Date().toISOString());
      </script>
    </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Output regular messages to keep the connection alive
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}`);
}, 5000);