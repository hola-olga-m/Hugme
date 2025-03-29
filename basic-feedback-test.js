/**
 * Extremely simple Express server specifically for the web application feedback tool
 * Running directly on port 5000 with no proxy or middleware
 */
import express from 'express';
const app = express();
const PORT = 5000;

// Simple route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Basic Feedback Test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #4a154b;
          }
        </style>
      </head>
      <body>
        <h1>Basic Feedback Test</h1>
        <p>This is a minimal server for testing the web application feedback tool.</p>
        <p>Current time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.send('OK');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Basic feedback test server running at http://0.0.0.0:${PORT}`);
});