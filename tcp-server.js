// Ultra-minimal TCP server to explicitly open port 5000
const net = require('net');
const PORT = 5000;

// Create a direct TCP server - most minimal way to open a port
const server = net.createServer(socket => {
  console.log('Client connected');
  
  socket.on('data', data => {
    console.log(`Received: ${data}`);
    
    // Send an HTTP response for any HTTP request
    if (data.toString().startsWith('GET')) {
      socket.write('HTTP/1.1 200 OK\r\n');
      socket.write('Content-Type: text/plain\r\n');
      socket.write('\r\n');
      socket.write('HugMeNow TCP Server is running\r\n');
      socket.end();
    }
  });
  
  socket.on('end', () => {
    console.log('Client disconnected');
  });
  
  socket.on('error', err => {
    console.error('Socket error:', err);
  });
});

// Handle server errors
server.on('error', err => {
  console.error('Server error:', err);
});

// Start listening on the port
server.listen(PORT, '0.0.0.0', () => {
  console.log(`TCP Server explicitly listening on 0.0.0.0:${PORT}`);
});

// Add heartbeat to confirm server is still running
setInterval(() => {
  console.log(`TCP Server heartbeat: ${new Date().toISOString()}`);
}, 5000);