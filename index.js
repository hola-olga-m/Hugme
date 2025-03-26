// Simple HTTP server that redirects all requests to port 5000
// where our Vite server is running
const http = require('http');

console.log('Starting HTTP redirect server...');

// Create a server that redirects all requests to port 5000
http.createServer((req, res) => {
  // Log the request
  console.log(`Received request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // If it's an OPTIONS request, respond with 200
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Redirect to port 5000
  res.writeHead(302, {
    'Location': `http://localhost:5000${req.url}`
  });
  res.end();
}).listen(4000, '0.0.0.0');

console.log('Redirect server is running on port 4000');
console.log('All requests will be redirected to http://localhost:5000');