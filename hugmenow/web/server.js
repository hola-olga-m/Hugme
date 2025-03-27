// Optimized Express server for HugMeNow application
// Using direct import to avoid unnecessary complexity
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Constants
const PORT = process.env.PORT || 5000;
const API_HOST = process.env.API_HOST || 'http://localhost:3000';

// Get directory paths
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = join(__dirname, 'public');
const srcPath = join(__dirname, 'src');

// Create Express app
const app = express();

// Enable CORS
app.use(cors());

// Body parser for JSON with increased limits
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// GraphQL improved proxy middleware
app.use('/graphql', (req, res, next) => {
  // For OPTIONS preflight requests
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.status(200).end();
    return;
  }
  
  // For POST requests, use our fallback method
  if (req.method === 'POST') {
    console.log('GraphQL request received, using direct forwarding');
    
    // Parse the request body if it's not already parsed
    if (!req.body) {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          handleGraphQLRequest(parsedBody, res);
        } catch (error) {
          console.error('Error parsing GraphQL request body:', error);
          res.status(400).json({ errors: [{ message: 'Invalid JSON in request body' }] });
        }
      });
    } else {
      // Body already parsed by body-parser
      handleGraphQLRequest(req.body, res);
    }
  } else {
    // For any other method, pass through to the next middleware
    next();
  }
});

// Helper function to handle GraphQL requests
function handleGraphQLRequest(body, res) {
  console.log('Processing GraphQL request:', body.query?.substring(0, 50) + '...');
  
  fetch(`${API_HOST}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  .then(response => response.json())
  .then(data => {
    console.log('GraphQL response received');
    res.json(data);
  })
  .catch(error => {
    console.error('GraphQL fetch error:', error);
    res.status(500).json({ 
      errors: [{ 
        message: 'Error processing GraphQL request', 
        details: error.message 
      }] 
    });
  });
}

// API proxy for backend requests
app.use('/api', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // Remove /api prefix when forwarding
  },
  onError: (err, req, res) => {
    console.error('API Proxy Error:', err);
    res.status(502).send('API Gateway error!');
  }
}));

// Info proxy
app.use('/api/info', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  pathRewrite: {
    '^/api/info': '/info' // Map to info endpoint on backend
  },
  onError: (err, req, res) => {
    console.error('Info Proxy Error:', err);
    res.status(502).send('Info Gateway error!');
  }
}));

// Static files from public directory
app.use(express.static(publicPath));

// Source files for development
app.use('/src', express.static(srcPath));

// Test GraphQL route - manual addition for testing GraphQL endpoint
app.get('/test-graphql', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>GraphQL Test - HugMeNow</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        pre { background: #f4f4f4; padding: 10px; border-radius: 4px; overflow: auto; }
        button { background: #5E35B1; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; margin-right: 10px; }
        #result { margin-top: 20px; }
        .control-panel { margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <h1>GraphQL Test</h1>
      <p>This page tests the GraphQL endpoint using different methods.</p>
      
      <div class="control-panel">
        <button id="test-graphql-direct">Test Direct NestJS GraphQL</button>
        <button id="test-graphql-proxy">Test GraphQL Proxy</button>
        <button id="test-api-proxy">Test API Info Endpoint</button>
      </div>
      
      <div id="result"></div>
      
      <script>
        const resultDiv = document.getElementById('result');
        
        // Direct test to NestJS GraphQL endpoint
        document.getElementById('test-graphql-direct').addEventListener('click', async () => {
          resultDiv.innerHTML = '<p>Testing direct GraphQL endpoint at http://localhost:3000/graphql...</p>';
          
          try {
            const response = await fetch('http://localhost:3000/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: \`
                  {
                    __schema {
                      queryType {
                        name
                      }
                    }
                  }
                \`
              }),
            });
            
            const data = await response.json();
            resultDiv.innerHTML = \`
              <p>Success! Direct GraphQL Response:</p>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (error) {
            resultDiv.innerHTML = \`
              <p>Error testing direct GraphQL:</p>
              <pre>\${error.toString()}</pre>
            \`;
          }
        });
        
        // Test GraphQL proxy endpoint
        document.getElementById('test-graphql-proxy').addEventListener('click', async () => {
          resultDiv.innerHTML = '<p>Testing GraphQL proxy endpoint at /graphql...</p>';
          
          try {
            const response = await fetch('/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                query: \`
                  {
                    __schema {
                      queryType {
                        name
                      }
                    }
                  }
                \`
              }),
            });
            
            const data = await response.json();
            resultDiv.innerHTML = \`
              <p>Success! GraphQL Proxy Response:</p>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (error) {
            resultDiv.innerHTML = \`
              <p>Error testing GraphQL proxy:</p>
              <pre>\${error.toString()}</pre>
            \`;
          }
        });
        
        // Test API info endpoint
        document.getElementById('test-api-proxy').addEventListener('click', async () => {
          resultDiv.innerHTML = '<p>Testing API info endpoint at /api/info...</p>';
          
          try {
            const response = await fetch('/api/info');
            const data = await response.json();
            resultDiv.innerHTML = \`
              <p>Success! API Info Response:</p>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (error) {
            resultDiv.innerHTML = \`
              <p>Error testing API info:</p>
              <pre>\${error.toString()}</pre>
            \`;
          }
        });
      </script>
    </body>
    </html>
  `);
});

// GraphQL direct handler - bypasses the proxy for testing
app.post('/direct-graphql', async (req, res) => {
  try {
    console.log('Direct GraphQL request:', req.body);
    
    const response = await fetch(`${API_HOST}/graphql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });
    
    const data = await response.json();
    console.log('Direct GraphQL response:', data);
    
    res.json(data);
  } catch (error) {
    console.error('Direct GraphQL error:', error);
    res.status(500).json({ error: error.toString() });
  }
});

// Home route - serves a simple HTML page with React linked directly
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HugMeNow - Emotional Wellness Platform</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        header {
          background: #5E35B1;
          color: white;
          padding: 1rem 0;
        }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          margin-left: 1.5rem;
        }
        .nav-link {
          color: white;
          text-decoration: none;
        }
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn {
          display: inline-block;
          background: #5E35B1;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
          border: none;
          cursor: pointer;
        }
        footer {
          text-align: center;
          padding: 1rem 0;
          border-top: 1px solid #eee;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="container">
          <nav class="nav">
            <div class="nav-logo">HugMeNow</div>
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="/" class="nav-link">Home</a>
              </li>
              <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
              </li>
              <li class="nav-item">
                <a href="/login" class="nav-link">Login</a>
              </li>
              <li class="nav-item">
                <a href="/register" class="nav-link">Register</a>
              </li>
              <li class="nav-item">
                <a href="/test-graphql" class="nav-link">GraphQL Test</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="container" style="padding: 2rem 0;">
          <h1>HugMeNow</h1>
          <p>Welcome to the HugMeNow emotional wellness platform</p>
          <div class="card">
            <h2>Getting Started</h2>
            <p>This is a simplified version of the application to verify the build process.</p>
            <div style="margin-top: 20px">
              <a href="/about" class="btn">Learn More</a>
            </div>
          </div>
        </div>
      </main>

      <footer>
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} HugMeNow. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `);
});

// About page
app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About HugMeNow</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        header {
          background: #5E35B1;
          color: white;
          padding: 1rem 0;
        }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          margin-left: 1.5rem;
        }
        .nav-link {
          color: white;
          text-decoration: none;
        }
        .card {
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .btn {
          display: inline-block;
          background: #5E35B1;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
        }
        footer {
          text-align: center;
          padding: 1rem 0;
          border-top: 1px solid #eee;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="container">
          <nav class="nav">
            <div class="nav-logo">HugMeNow</div>
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="/" class="nav-link">Home</a>
              </li>
              <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
              </li>
              <li class="nav-item">
                <a href="/login" class="nav-link">Login</a>
              </li>
              <li class="nav-item">
                <a href="/register" class="nav-link">Register</a>
              </li>
              <li class="nav-item">
                <a href="/test-graphql" class="nav-link">GraphQL Test</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="container" style="padding: 2rem 0;">
          <h1>About HugMeNow</h1>
          <p>A mobile-first emotional wellness platform that provides intuitive mental health tracking.</p>
          <div class="card">
            <h2>Features</h2>
            <ul>
              <li>Mood tracking</li>
              <li>Virtual hugs</li>
              <li>Community support</li>
              <li>Personal wellness journal</li>
            </ul>
          </div>
          <div style="margin-top: 20px">
            <a href="/" class="btn">Back to Home</a>
          </div>
        </div>
      </main>

      <footer>
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} HugMeNow. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `);
});

// Login page
app.get('/login', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Login - HugMeNow</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        header {
          background: #5E35B1;
          color: white;
          padding: 1rem 0;
        }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          margin-left: 1.5rem;
        }
        .nav-link {
          color: white;
          text-decoration: none;
        }
        .auth-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .btn {
          display: inline-block;
          background: #5E35B1;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        .auth-title {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #5E35B1;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1rem;
        }
        footer {
          text-align: center;
          padding: 1rem 0;
          border-top: 1px solid #eee;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="container">
          <nav class="nav">
            <div class="nav-logo">HugMeNow</div>
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="/" class="nav-link">Home</a>
              </li>
              <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
              </li>
              <li class="nav-item">
                <a href="/login" class="nav-link">Login</a>
              </li>
              <li class="nav-item">
                <a href="/register" class="nav-link">Register</a>
              </li>
              <li class="nav-item">
                <a href="/test-graphql" class="nav-link">GraphQL Test</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="auth-container">
          <h1 class="auth-title">Login</h1>
          <form id="login-form">
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="Enter your password" required>
            </div>
            <button type="submit" class="btn">Login</button>
          </form>
          <div class="auth-footer">
            <p>Don't have an account? <a href="/register">Register</a></p>
          </div>
        </div>
        
        <script>
          document.getElementById('login-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = this.email.value;
            const password = this.password.value;
            
            try {
              const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                alert('Login successful!');
                // Store token in localStorage
                localStorage.setItem('token', data.token);
                // Redirect to dashboard
                window.location.href = '/dashboard';
              } else {
                alert('Login failed: ' + (data.message || 'Unknown error'));
              }
            } catch (error) {
              alert('Error: ' + error.toString());
            }
          });
        </script>
      </main>

      <footer>
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} HugMeNow. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `);
});

// Register page
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Register - HugMeNow</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          color: #333;
        }
        .container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
        }
        header {
          background: #5E35B1;
          color: white;
          padding: 1rem 0;
        }
        .nav {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .nav-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }
        .nav-menu {
          display: flex;
          list-style: none;
          margin: 0;
          padding: 0;
        }
        .nav-item {
          margin-left: 1.5rem;
        }
        .nav-link {
          color: white;
          text-decoration: none;
        }
        .auth-container {
          max-width: 400px;
          margin: 2rem auto;
          padding: 2rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .form-group {
          margin-bottom: 1rem;
        }
        .form-label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: bold;
        }
        .form-input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ddd;
          border-radius: 4px;
          font-size: 1rem;
        }
        .btn {
          display: inline-block;
          background: #5E35B1;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
          border: none;
          cursor: pointer;
          width: 100%;
        }
        .auth-title {
          text-align: center;
          margin-bottom: 1.5rem;
          color: #5E35B1;
        }
        .auth-footer {
          text-align: center;
          margin-top: 1rem;
        }
        footer {
          text-align: center;
          padding: 1rem 0;
          border-top: 1px solid #eee;
          margin-top: 2rem;
        }
      </style>
    </head>
    <body>
      <header class="header">
        <div class="container">
          <nav class="nav">
            <div class="nav-logo">HugMeNow</div>
            <ul class="nav-menu">
              <li class="nav-item">
                <a href="/" class="nav-link">Home</a>
              </li>
              <li class="nav-item">
                <a href="/about" class="nav-link">About</a>
              </li>
              <li class="nav-item">
                <a href="/login" class="nav-link">Login</a>
              </li>
              <li class="nav-item">
                <a href="/register" class="nav-link">Register</a>
              </li>
              <li class="nav-item">
                <a href="/test-graphql" class="nav-link">GraphQL Test</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="auth-container">
          <h1 class="auth-title">Register</h1>
          <form id="register-form">
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" name="username" class="form-input" placeholder="Choose a username" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" name="name" class="form-input" placeholder="Enter your full name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="Create a password" required>
            </div>
            <div class="form-group">
              <label class="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" class="form-input" placeholder="Confirm your password" required>
            </div>
            <button type="submit" class="btn">Register</button>
          </form>
          <div class="auth-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
          </div>
        </div>
        
        <script>
          document.getElementById('register-form').addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = this.username.value;
            const email = this.email.value;
            const name = this.name.value;
            const password = this.password.value;
            const confirmPassword = this.confirmPassword.value;
            
            if (password !== confirmPassword) {
              alert('Passwords do not match');
              return;
            }
            
            try {
              const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, name, password }),
              });
              
              const data = await response.json();
              
              if (response.ok) {
                alert('Registration successful!');
                // Store token in localStorage
                localStorage.setItem('token', data.token);
                // Redirect to dashboard
                window.location.href = '/dashboard';
              } else {
                alert('Registration failed: ' + (data.message || 'Unknown error'));
              }
            } catch (error) {
              alert('Error: ' + error.toString());
            }
          });
        </script>
      </main>

      <footer>
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} HugMeNow. All rights reserved.</p>
        </div>
      </footer>
    </body>
    </html>
  `);
});

// Catch-all handler
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log('Starting HugMeNow server on port ' + PORT + '...');
  console.log('### SERVER LISTENING ON PORT ' + PORT + ' ###');
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API proxy configured to: ${API_HOST}`);
});