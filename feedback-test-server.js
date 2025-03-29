/**
 * Simple Express server for the web application feedback tool
 * Binds directly to port 5000 which is the port Replit can access
 */
import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import path from 'path';
import fs from 'fs';

const PORT = 5001;
const app = express();

// Serve static test.html for the root path
app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>HugMeNow - Feedback Test</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f7f9fc;
          }
          h1 {
            color: #4a154b;
          }
          .card {
            background-color: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          button {
            background-color: #4a154b;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            margin-top: 10px;
          }
          button:hover {
            background-color: #611f69;
          }
          .result {
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            margin-top: 10px;
            min-height: 50px;
          }
          .success {
            color: green;
          }
          .error {
            color: red;
          }
        </style>
      </head>
      <body>
        <h1>HugMeNow Feedback Test Page</h1>
        
        <div class="card">
          <h2>Server Status</h2>
          <p>The feedback test server is running on port ${PORT}.</p>
          <p>Current time: <span id="current-time"></span></p>
        </div>
        
        <div class="card">
          <h2>API Test</h2>
          <button id="test-hello">Test Hello API</button>
          <div id="hello-result" class="result">Click the button to test...</div>
        </div>
        
        <div class="card">
          <h2>GraphQL Test</h2>
          <button id="test-graphql">Test GraphQL</button>
          <div id="graphql-result" class="result">Click the button to test...</div>
        </div>
        
        <div class="card">
          <h2>Server Information</h2>
          <ul>
            <li>Server: Express.js</li>
            <li>Port: ${PORT}</li>
            <li>Node Version: ${process.version}</li>
          </ul>
        </div>
        
        <script>
          // Update current time
          function updateTime() {
            document.getElementById('current-time').textContent = new Date().toLocaleString();
          }
          updateTime();
          setInterval(updateTime, 1000);
          
          // Test Hello API
          document.getElementById('test-hello').addEventListener('click', async () => {
            const resultDiv = document.getElementById('hello-result');
            resultDiv.innerHTML = 'Testing API...';
            resultDiv.className = 'result';
            
            try {
              const response = await fetch('/hello');
              if (response.ok) {
                const data = await response.json();
                resultDiv.innerHTML = '<span class="success">Success!</span><br>Response: ' + JSON.stringify(data);
              } else {
                resultDiv.innerHTML = '<span class="error">Error ' + response.status + '</span><br>' + response.statusText;
              }
            } catch (error) {
              resultDiv.innerHTML = '<span class="error">Error</span><br>' + error.message;
            }
          });
          
          // Test GraphQL
          document.getElementById('test-graphql').addEventListener('click', async () => {
            const resultDiv = document.getElementById('graphql-result');
            resultDiv.innerHTML = 'Testing GraphQL...';
            resultDiv.className = 'result';
            
            try {
              const response = await fetch('/graphql', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  query: '{ __schema { queryType { name } } }'
                }),
              });
              
              const data = await response.json();
              resultDiv.innerHTML = '<span class="success">Success!</span><br>Response: ' + JSON.stringify(data);
            } catch (error) {
              resultDiv.innerHTML = '<span class="error">Error</span><br>' + error.message;
            }
          });
        </script>
      </body>
    </html>
  `;
  res.send(html);
});

// Add a simple hello endpoint for testing
app.get('/hello-direct', (req, res) => {
  res.json({ message: 'Hello from feedback test server', timestamp: new Date().toISOString() });
});

// Proxy API requests to the API server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api'
  },
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying ' + req.method + ' ' + req.url + ' to API server');
  }
}));

// Proxy hello endpoint
app.use('/hello', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying ' + req.method + ' ' + req.url + ' to API server hello endpoint');
  }
}));

// Proxy GraphQL requests to the API server
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3003',
  changeOrigin: true,
  onProxyReq: (proxyReq, req, res) => {
    console.log('Proxying ' + req.method + ' ' + req.url + ' to GraphQL server');
  }
}));

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Feedback test server running at http://0.0.0.0:' + PORT);
  console.log('API proxy: http://localhost:3003');
  console.log('GraphQL endpoint: http://localhost:3003/graphql');
});