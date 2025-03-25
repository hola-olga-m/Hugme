// Absolute minimal HTTP server - direct NodeJS implementation
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;

// Create the server with minimal config
const server = http.createServer((req, res) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: PORT
    }));
    return;
  }
  
  // Serve index.html for root path
  if (req.url === '/' || req.url === '/index.html') {
    fs.readFile(path.join(__dirname, 'public', 'index.html'), (err, content) => {
      if (err) {
        res.writeHead(500);
        res.end(`Error loading index.html: ${err.message}`);
        return;
      }
      
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(content);
    });
    return;
  }
  
  // For all other routes, redirect to home
  res.writeHead(302, {
    'Location': '/'
  });
  res.end();
});

// Start the server 
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Minimal HTTP server running on http://0.0.0.0:${PORT}`);
});

// Add a heartbeat ping
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}`);
}, 5000);