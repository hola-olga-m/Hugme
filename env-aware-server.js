// Environment-aware server that uses Replit's PORT environment variable
const express = require('express');
const path = require('path');
const app = express();

// Use Replit's environment PORT variable or fallback to 5000
const PORT = process.env.PORT || 5000;

// Log basic request information
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT,
    environment: {
      port: process.env.PORT,
      node_env: process.env.NODE_ENV,
      replit_slug: process.env.REPL_SLUG,
      replit_owner: process.env.REPL_OWNER
    }
  });
});

// Root path handler
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Catch all unmatched routes
app.use((req, res) => {
  res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Access your application at https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
});

// Heartbeat for monitoring
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}`);
}, 5000);