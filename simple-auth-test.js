/**
 * Simple Express server for testing authentication
 * @type {module}
 */

import express from 'express';
import cors from 'cors';
import path from 'path';

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Serve static files
app.use(express.static('public'));

// Simple authentication page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Auth Test</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        .card { border: 1px solid #ccc; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
        button { padding: 8px 16px; background: #4CAF50; color: white; border: none; border-radius: 4px; cursor: pointer; }
        button:hover { background: #45a049; }
        input { padding: 8px; margin-bottom: 10px; width: 100%; box-sizing: border-box; }
        .error { color: red; }
        .success { color: green; }
      </style>
    </head>
    <body>
      <h1>Authentication Test</h1>
      
      <div class="card">
        <h2>Login</h2>
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" placeholder="Email" value="test@example.com" />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" placeholder="Password" value="password123" />
        </div>
        <button id="loginBtn">Login</button>
        <div id="loginStatus"></div>
      </div>

      <div class="card">
        <h2>Auth Status</h2>
        <div id="authStatus">Not authenticated</div>
        <button id="checkAuthBtn">Check Auth Status</button>
        <button id="logoutBtn">Logout</button>
      </div>

      <div class="card">
        <h2>Response Time Test</h2>
        <div>
          <label for="delay">Response Delay (ms):</label>
          <input type="number" id="delay" value="3000" />
        </div>
        <button id="testTimeoutBtn">Test Response Timeout</button>
        <div id="timeoutStatus"></div>
      </div>

      <script>
        // Handle login
        document.getElementById('loginBtn').addEventListener('click', async () => {
          const email = document.getElementById('email').value;
          const password = document.getElementById('password').value;
          const loginStatus = document.getElementById('loginStatus');
          
          loginStatus.innerHTML = 'Logging in...';
          
          try {
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
              loginStatus.innerHTML = '<span class="success">Login successful!</span>';
              localStorage.setItem('authToken', data.token);
              localStorage.setItem('user', JSON.stringify(data.user));
              updateAuthStatus();
            } else {
              loginStatus.innerHTML = '<span class="error">Login failed: ' + (data.error || 'Unknown error') + '</span>';
            }
          } catch (err) {
            loginStatus.innerHTML = '<span class="error">Error: ' + err.message + '</span>';
          }
        });
        
        // Check auth status
        function updateAuthStatus() {
          const authStatus = document.getElementById('authStatus');
          const token = localStorage.getItem('authToken');
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          
          if (token && user) {
            authStatus.innerHTML = '<span class="success">Authenticated as ' + user.name + '</span>';
          } else {
            authStatus.innerHTML = '<span class="error">Not authenticated</span>';
          }
        }
        
        document.getElementById('checkAuthBtn').addEventListener('click', updateAuthStatus);
        
        // Handle logout
        document.getElementById('logoutBtn').addEventListener('click', () => {
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
          updateAuthStatus();
          document.getElementById('loginStatus').innerHTML = '<span>Logged out</span>';
        });
        
        // Test timeout
        document.getElementById('testTimeoutBtn').addEventListener('click', async () => {
          const delay = document.getElementById('delay').value;
          const timeoutStatus = document.getElementById('timeoutStatus');
          
          timeoutStatus.innerHTML = 'Testing response with ' + delay + 'ms delay...';
          
          try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
            
            const response = await fetch('/api/delayed?delay=' + delay, {
              signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            const data = await response.json();
            timeoutStatus.innerHTML = '<span class="success">Response received: ' + data.message + '</span>';
          } catch (err) {
            if (err.name === 'AbortError') {
              timeoutStatus.innerHTML = '<span class="error">Request timed out after 5 seconds</span>';
            } else {
              timeoutStatus.innerHTML = '<span class="error">Error: ' + err.message + '</span>';
            }
          }
        });
        
        // Initialize page
        updateAuthStatus();
      </script>
    </body>
    </html>
  `);
});

// Login endpoint
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulate authentication
  if (email === 'test@example.com' && password === 'password123') {
    res.json({
      token: 'test-auth-token-123',
      user: {
        id: '1',
        name: 'Test User',
        email: 'test@example.com'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Delayed response endpoint
app.get('/api/delayed', (req, res) => {
  const delay = parseInt(req.query.delay || '1000', 10);
  
  setTimeout(() => {
    res.json({ message: `Response after ${delay}ms delay` });
  }, delay);
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth test server running on port ${PORT}`);
  console.log(`Open in your browser: http://localhost:${PORT}`);
});