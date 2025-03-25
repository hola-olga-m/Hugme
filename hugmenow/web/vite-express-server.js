const express = require('express');
const path = require('path');
const http = require('http');

// Create Express app
const app = express();
const PORT = 5000;

// Simple static file server
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API and GraphQL proxies
app.all('/api/*', (req, res) => {
  res.json({ message: 'API proxy would be here - mock response' });
});

app.all('/graphql', (req, res) => {
  res.json({ message: 'GraphQL proxy would be here - mock response' });
});

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Create a basic index.html if it doesn't exist
const fs = require('fs');
const publicDir = path.join(__dirname, 'public');
const indexPath = path.join(publicDir, 'index.html');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

if (!fs.existsSync(indexPath)) {
  const basicHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HugMeNow App</title>
    </head>
    <body>
      <div id="root">
        <h1>HugMeNow Frontend Server</h1>
        <p>Server is running successfully on port ${PORT}</p>
      </div>
    </body>
    </html>
  `;
  fs.writeFileSync(indexPath, basicHtml);
}

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});