/**
 * Simple Express server for testing
 */

const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Proxy API requests
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true
}));

// Proxy GraphQL requests
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3004',
  changeOrigin: true
}));

// Serve static files from the web directory
const staticPath = path.join(__dirname, 'hugmenow/web/dist');
app.use(express.static(staticPath));

// Create a simple test page
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Auth Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        button { padding: 10px; margin: 5px; background: #4CAF50; color: white; border: none; cursor: pointer; }
        input { padding: 10px; margin: 5px; width: 300px; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow: auto; }
      </style>
    </head>
    <body>
      <h1>Auth API Test Page</h1>
      
      <h2>Register</h2>
      <div>
        <input id="reg-username" placeholder="Username" />
        <input id="reg-email" placeholder="Email" />
        <input id="reg-name" placeholder="Full Name" />
        <input id="reg-password" type="password" placeholder="Password" />
        <button id="register-btn">Register</button>
      </div>
      
      <h2>Login</h2>
      <div>
        <input id="login-email" placeholder="Email" />
        <input id="login-password" type="password" placeholder="Password" />
        <button id="login-btn">Login</button>
      </div>
      
      <h2>Results:</h2>
      <pre id="results">No results yet</pre>

      <script>
        document.getElementById('register-btn').addEventListener('click', async () => {
          const username = document.getElementById('reg-username').value;
          const email = document.getElementById('reg-email').value;
          const name = document.getElementById('reg-name').value;
          const password = document.getElementById('reg-password').value;
          
          const results = document.getElementById('results');
          results.textContent = 'Registering...';
          
          try {
            console.time('register');
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registerInput: { username, email, name, password }
              })
            });
            console.timeEnd('register');
            
            const data = await response.json();
            results.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            results.textContent = 'Error: ' + err.message;
          }
        });
        
        document.getElementById('login-btn').addEventListener('click', async () => {
          const email = document.getElementById('login-email').value;
          const password = document.getElementById('login-password').value;
          
          const results = document.getElementById('results');
          results.textContent = 'Logging in...';
          
          try {
            console.time('login');
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                loginInput: { email, password }
              })
            });
            console.timeEnd('login');
            
            const data = await response.json();
            results.textContent = JSON.stringify(data, null, 2);
          } catch (err) {
            results.textContent = 'Error: ' + err.message;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// For all other routes, serve the index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Test server running at http://0.0.0.0:${PORT}`);
  console.log(`Test page: http://0.0.0.0:${PORT}/test`);
});