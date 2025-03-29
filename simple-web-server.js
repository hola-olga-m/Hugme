import express from 'express';
const app = express();
const PORT = 5000;

// Simple route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HugMeNow Test Server</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #4a154b;
          }
          .card {
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        </style>
      </head>
      <body>
        <h1>HugMeNow</h1>
        <div class="card">
          <h2>Server Status</h2>
          <p>The simple web server is running correctly.</p>
          <p>Current time: ${new Date().toISOString()}</p>
        </div>
        <div class="card">
          <h2>Server Information</h2>
          <ul>
            <li>Server: Express.js</li>
            <li>Port: ${PORT}</li>
            <li>Node Version: ${process.version}</li>
          </ul>
        </div>
        <div class="card">
          <h2>Links</h2>
          <ul>
            <li><a href="/health">Health Check</a></li>
            <li><a href="/info">Server Info</a></li>
          </ul>
        </div>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// Info endpoint
app.get('/info', (req, res) => {
  res.json({
    server: 'Express.js',
    port: PORT,
    nodeVersion: process.version,
    time: new Date().toISOString()
  });
});

// Log all requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple web server running at http://0.0.0.0:${PORT}`);
});