// Absolute bare minimum server - single file, no dependencies
const http = require('http');
const PORT = 5000;

// Create server with the simplest possible handler
const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('HugMeNow is running!');
});

// Start listening
server.listen(PORT, '0.0.0.0');

// Confirm it's running
console.log(`Server running on port ${PORT}`);

// Set up basic interval to keep logs active
setInterval(() => {
  console.log(`Still running on port ${PORT}`);
}, 5000);