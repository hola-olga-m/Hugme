const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

// Simple logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Root route - just return text for web application feedback tool
app.get('/', (req, res) => {
  res.send('HugMeNow Test Server is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'UP', message: 'Test server is running' });
});

// Plain text health check
app.get('/health-text', (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send('Test server is running');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running on http://0.0.0.0:${PORT}`);
});