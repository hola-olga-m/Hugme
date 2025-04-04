import express from 'express';
const app = express();
const port = 5000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>HugMeNow - Simple Test Page</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            text-align: center;
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
        <h1>HugMeNow Simple Test Page</h1>
        <div class="card">
          <h2>Server Status</h2>
          <p>The simple test server is running correctly on port 5000.</p>
          <p>Current time: ${new Date().toISOString()}</p>
          <p>This is a minimal test server to verify the web application feedback tool works.</p>
        </div>
      </body>
    </html>
  `);
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Simple test server listening at http://0.0.0.0:${port}`);
});