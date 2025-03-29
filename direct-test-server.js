/**
 * A simple test server to check access via the web application feedback tool
 */
import express from 'express';
const app = express();
const PORT = 5005;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HugMeNow - Test Page</title>
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
        <h1>HugMeNow Test Page</h1>
        <div class="card">
          <h2>Server Status</h2>
          <p>The test server is running correctly.</p>
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
      </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Direct test server running at http://0.0.0.0:${PORT}`);
});