/**
 * Absolutely minimal HTTP server for Replit's web application feedback tool
 * with added CORS headers and detailed logging
 */

import http from 'http';
import fs from 'fs';

// Create the simplest possible server
http.createServer((req, res) => {
  const timestamp = new Date().toISOString();
  
  // Log detailed request information
  console.log(`[${timestamp}] ${req.method} ${req.url} from ${req.socket.remoteAddress}`);
  console.log(`Headers: ${JSON.stringify(req.headers)}`);
  
  // Log to file for analysis
  fs.appendFileSync('minimal_server_requests.log', 
    `[${timestamp}] ${req.method} ${req.url} from ${req.socket.remoteAddress}\n` +
    `Headers: ${JSON.stringify(req.headers)}\n\n`
  );

  // Add CORS headers to support cross-origin requests
  const headers = {
    'Content-Type': 'text/html',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400' // 24 hours
  };
  
  // Handle OPTIONS method for CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(204, headers);
    res.end();
    return;
  }
  
  // Handle all other requests with a simple HTML response
  res.writeHead(200, headers);
  res.end(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Minimal Server</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <h1>Minimal Server Working</h1>
        <p>This page was served at: ${timestamp}</p>
        <p>Request method: ${req.method}</p>
        <p>Request URL: ${req.url}</p>
        <p>Client IP: ${req.socket.remoteAddress}</p>
      </body>
    </html>
  `);
}).listen(5000, '0.0.0.0', () => {
  console.log('Enhanced minimal server running on http://0.0.0.0:5000');
  console.log('Server started at: ' + new Date().toISOString());
});