/**
 * Absolute bare minimum Express server specifically for Replit's web application feedback tool
 * Stripped down to the absolute minimum possible code
 */

import express from 'express';
const app = express();
const port = 5000;

// Simple route that returns HTML
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Port 5000 Test</title>
        <style>body { font-family: sans-serif; }</style>
      </head>
      <body>
        <h1>Port 5000 Test</h1>
        <p>This server is running on port 5000</p>
        <p>Current time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`Minimal test server running at http://0.0.0.0:${port}`);
});