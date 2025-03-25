// Ultra-minimal server for Replit environment
const express = require('express');
const app = express();
const PORT = 5000;

// Simple response for root path
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HugMeNow</title>
        <style>
          body { 
            font-family: sans-serif; 
            margin: 40px; 
            text-align: center;
          }
          h1 { color: #4361ee; }
        </style>
      </head>
      <body>
        <h1>HugMeNow</h1>
        <p>Server is running on port ${PORT}</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Add error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start server with specific settings for Replit
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`Replit-specific server running at http://0.0.0.0:${PORT}`);
  
  // Log server address information
  const addr = server.address();
  console.log(`Server bound to ${addr.address}:${addr.port}`);
});

// Enable keep-alive
server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

// Log active connections for debugging
let connections = 0;
server.on('connection', socket => {
  connections++;
  console.log(`New connection: ${connections} active`);
  
  socket.on('close', () => {
    connections--;
    console.log(`Connection closed: ${connections} active`);
  });
});

// Regular heartbeat
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}, ${connections} active connections`);
}, 5000);