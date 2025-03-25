// minimal-server.js - Bare minimum HTTP server for Replit
import http from 'http';

const PORT = 3001;

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>HugMeNow</title>
        <style>
          body { font-family: Arial, sans-serif; text-align: center; margin-top: 50px; }
          .message { margin: 20px; padding: 20px; background-color: #f7f7f7; border-radius: 5px; }
          h1 { color: #4a6fa5; }
          .status { color: #47b475; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>HugMeNow Web App</h1>
        <div class="message">
          <p class="status">Server Status: Online</p>
          <p>Minimal server running successfully!</p>
          <p>Timestamp: ${new Date().toISOString()}</p>
        </div>
        <script>
          console.log('HugMeNow minimal server page loaded');
        </script>
      </body>
    </html>
  `);
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal server running on http://0.0.0.0:${PORT}`);
});

// Log a message every 5 seconds to show the server is still running
setInterval(() => {
  console.log(`Heartbeat: Server running at ${new Date().toISOString()}`);
}, 5000);