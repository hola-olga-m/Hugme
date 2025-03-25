// simple-server.js - A simplified server for workflow testing
import express from 'express';
const app = express();
const PORT = 5000;

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok', 
    port: PORT, 
    time: new Date().toISOString(),
    message: 'Simple test server is running!'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head><title>HugMeNow Test Server</title></head>
      <body>
        <h1>HugMeNow Test Server</h1>
        <p>This is a simplified server for testing workflow detection.</p>
        <p>The time is now: ${new Date().toISOString()}</p>
        <p>Check the <a href="/health">health endpoint</a> for server status.</p>
      </body>
    </html>
  `);
});

// Add route to test basic connectivity
app.get('/alive', (req, res) => {
  res.status(200).send('Server is alive!');
});

// Handle 404s
app.use((req, res) => {
  console.log(`404 request for: ${req.url}`);
  res.status(404).send('Not found');
});

// Start server with more detailed logging
console.log('***************************************************');
console.log(`* Starting SIMPLIFIED server on port ${PORT}...   *`);
console.log(`* Binding to ALL interfaces (0.0.0.0)            *`);
console.log('***************************************************');

// Create server and save reference for error handling
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`*** TEST SERVER RUNNING ON PORT ${PORT} ***`);
  console.log(`*** Listening on http://0.0.0.0:${PORT} ***`);
  console.log(`*** Health check: http://0.0.0.0:${PORT}/health ***`);
  console.log(`*** Liveness probe: http://0.0.0.0:${PORT}/alive ***`);
  console.log(`Server time: ${new Date().toISOString()}`);
  console.log('Server is ready for workflow detection!');
  
  // Verify server properties
  console.log(`Server listening: ${server.listening}`);
  
  // Print all listening addresses
  const addressInfo = server.address();
  console.log('Server address info:', addressInfo);
});

// Handle server errors
server.on('error', (error) => {
  console.error('Server error occurred:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`Port ${PORT} is already in use!`);
  }
});