// Port Binder for Replit - specialized for Replit's port detection mechanism
const http = require('http');
const PORT = 5000;

// Create a dedicated HTTP server that immediately acknowledges connections
const server = http.createServer((req, res) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  
  // Set CORS headers to allow all origins
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Send a simple response for all requests
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('HugMeNow is running! Timestamp: ' + new Date().toISOString());
});

// Handle server errors explicitly
server.on('error', (err) => {
  console.error('Server error:', err.message);
  if (err.code === 'EADDRINUSE') {
    console.error('Port 5000 is already in use. Trying again in 5 seconds...');
    setTimeout(() => {
      server.close();
      server.listen(PORT, '0.0.0.0');
    }, 5000);
  }
});

// Add explicit connection handler
server.on('connection', (socket) => {
  console.log('New TCP connection established');
  socket.on('error', (err) => {
    console.error('Socket error:', err.message);
  });
});

// Start the server
console.log('Starting HTTP server...');
server.listen(PORT, '0.0.0.0', () => {
  const addr = server.address();
  console.log(`Port Binder active on ${addr.address}:${addr.port}`);
  console.log('Ready for connections');
});

// Regular heartbeat to show the server is running
let uptime = 0;
setInterval(() => {
  uptime += 5;
  console.log(`Server uptime: ${uptime} seconds. Running on port ${PORT}.`);
}, 5000);