// Optimized single-file server with explicit port signaling
const http = require('http');
const fs = require('fs');
const path = require('path');

// Use the environment-provided port or default to 5000
const PORT = process.env.PORT || 5000;

// Simple file server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Health check endpoint
  if (req.url === '/health' || req.url === '/health/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      port: PORT,
      environment: {
        port: process.env.PORT,
        node_env: process.env.NODE_ENV,
        replit_slug: process.env.REPL_SLUG,
        replit_owner: process.env.REPL_OWNER
      }
    }));
  }
  
  // Determine file path
  let filePath = '.' + req.url;
  if (filePath === './') {
    filePath = './public/index.html';
  } else if (filePath === './heartbeat') {
    filePath = './public/heartbeat.html';
  } else {
    filePath = './public' + req.url;
  }
  
  // Get file extension and determine content type
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml'
  };
  const contentType = contentTypes[extname] || 'text/plain';
  
  // Read and serve the file
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found - serve index.html instead (SPA approach)
        fs.readFile('./public/index.html', (err, content) => {
          if (err) {
            res.writeHead(500);
            res.end('Error loading the application');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(content, 'utf-8');
          }
        });
      } else {
        // Server error
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success - serve the file
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

// Explicit port signaling
server.listen(PORT, '0.0.0.0', () => {
  // Standard logging
  console.log(`Server running on port ${PORT}`);
  
  // Explicit Replit URL logging
  if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
    console.log(`Access your application at https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
  }
  
  // Explicit port signal for Replit
  process.stdout.write(`PORT=${PORT}\n`);
});

// Heartbeat logging
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}`);
}, 30000);