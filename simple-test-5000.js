/**
 * Extremely simple Express server on port 5000 for Replit's web application feedback tool
 * Stripped down to the absolute minimum
 */

import express from 'express';
const app = express();
const PORT = 5000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Simple Test Server</title>
      </head>
      <body>
        <h1>Simple Test Server is Running!</h1>
        <p>This is a simple test page served on port 5000.</p>
      </body>
    </html>
  `);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on port ${PORT}`);
});