/**
 * Simple Express server for testing authentication
 */

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Enable CORS for all routes
app.use(cors());

// Parse JSON request bodies
app.use(express.json());

// Simple in-memory storage for testing
const users = [];

// Auth API endpoint for testing
app.post('/api/register', (req, res) => {
  console.log('Register request received:', req.body);
  
  const userData = req.body.registerInput;
  
  // Simple validation
  if (!userData || !userData.email || !userData.password) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Email and password are required'
    });
  }
  
  // Check if user already exists
  const existingUser = users.find(u => u.email === userData.email);
  if (existingUser) {
    return res.status(409).json({ 
      error: 'User already exists',
      details: 'Email is already registered'
    });
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name || '',
    username: userData.username || '',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  
  // Simulate delayed response
  setTimeout(() => {
    res.status(201).json({
      token: 'test-auth-token-' + newUser.id,
      user: newUser
    });
  }, 500);
});

// Login endpoint
app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body);
  
  const loginData = req.body.loginInput;
  
  // Simple validation
  if (!loginData || !loginData.email || !loginData.password) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      details: 'Email and password are required'
    });
  }
  
  // Find user
  const user = users.find(u => u.email === loginData.email);
  if (!user) {
    return res.status(401).json({ 
      error: 'Authentication failed',
      details: 'Invalid email or password'
    });
  }
  
  // Simulate delayed response
  setTimeout(() => {
    res.status(200).json({
      token: 'test-auth-token-' + user.id,
      user: user
    });
  }, 500);
});

// Get all users
app.get('/api/users', (req, res) => {
  res.json(users);
});

// Serve test page
app.get('/', (req, res) => {
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
            const response = await fetch('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registerInput: { username, email, name, password }
              })
            });
            
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
            const response = await fetch('/api/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                loginInput: { email, password }
              })
            });
            
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

// Custom delay endpoints for testing timeouts
app.use('/api/register-slow', (req, res) => {
  console.log('Slow registration request - will delay for 20 seconds');
  setTimeout(() => {
    res.status(500).json({ error: 'This should time out before you see this' });
  }, 20000);
});

app.use('/api/login-slow', (req, res) => {
  console.log('Slow login request - will delay for 20 seconds');
  setTimeout(() => {
    res.status(500).json({ error: 'This should time out before you see this' });
  }, 20000);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth test server running at http://0.0.0.0:${PORT}`);
});