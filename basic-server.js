/**
 * Extremely simple Express server on port 5000 for Replit's web application feedback tool
 * Stripped down to the absolute minimum
 */
import express from 'express';
const app = express();
const PORT = 5000;

// Serve a very simple HTML page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Test Server</title>
      </head>
      <body>
        <h1>Test Server</h1>
        <p>Basic test server is running on port 5000.</p>
        <p>Time: ${new Date().toISOString()}</p>
      </body>
    </html>
  `);
});

// Start server on all interfaces
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});