// Replit-optimized server that focuses on port detection compatibility
const http = require('http');
const PORT = 5000;

// Report port is open as early as possible
process.stdout.write(`PORT=${PORT}\n`);

// Create the simplest possible server
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('HugMeNow server is running');
});

// Handle errors explicitly to avoid silent failures
server.on('error', (err) => {
  console.error('Server error:', err.message);
  process.exit(1); // Exit on error for immediate feedback
});

// Start listening immediately
console.log(`Starting server on port ${PORT}...`);
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is now listening on port ${PORT}`);
  // Double confirmation for port systems
  process.stdout.write(`SUCCESS: Listening on port ${PORT}\n`);
});

// Heartbeat for logs
setInterval(() => {
  console.log(`Server running on port ${PORT}`);
}, 5000);