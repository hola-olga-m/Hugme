/**
 * Extremely simple Express server for testing Replit's web application feedback tool
 * Bare minimum implementation
 */
import express from 'express';
const app = express();
const PORT = 5000;

// Serve a minimal HTML page
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html>
<head>
  <title>Basic Test</title>
</head>
<body>
  <h1>Basic Test Server</h1>
  <p>This is a test server running on port ${PORT}.</p>
  <p>Time: ${new Date().toLocaleString()}</p>
</body>
</html>
  `);
});

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// Log all requests
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple test server running on port ${PORT}`);
});