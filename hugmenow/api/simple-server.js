// simple-server.js - A minimal NestJS server substitute for Replit
const http = require('http');

const PORT = 3002;

// Create a simple HTTP server for the API
const server = http.createServer((req, res) => {
  console.log(`API Request received: ${req.method} ${req.url}`);
  
  // Add CORS headers to allow cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    return res.end();
  }
  
  // Health check endpoint
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      status: 'ok',
      service: 'API',
      time: new Date().toISOString()
    }));
  }
  
  // Root endpoint
  if (req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    return res.end(JSON.stringify({
      name: 'HugMeNow API',
      version: '0.1.0',
      status: 'running',
      endpoints: ['/health', '/api/auth/login', '/graphql']
    }));
  }
  
  // Mock login endpoint
  if (req.url === '/api/auth/login' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          token: 'mock-jwt-token',
          user: {
            id: 'user-123',
            name: 'Demo User',
            email: data.email || 'demo@example.com'
          }
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid request body' }));
      }
    });
    
    return;
  }
  
  // Basic GraphQL endpoint
  if (req.url === '/graphql' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        
        // Mock GraphQL response
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          data: {
            hello: 'world',
            serverTime: new Date().toISOString()
          }
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid GraphQL request' }));
      }
    });
    
    return;
  }
  
  // Fallback for unknown endpoints
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Endpoint not found' }));
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Simple API server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Server is listening on port: ${PORT}`);
  console.log(`Server is bound to address: 0.0.0.0`);
  console.log(`Simple API Server is ready to accept connections`);
});

// Handle errors
server.on('error', (error) => {
  console.error('Server error:', error.message);
});