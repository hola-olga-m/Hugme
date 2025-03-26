// Optimized Express server for HugMeNow application
import express from 'express';
import cors from 'cors';
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

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Setup API proxy for backend requests
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

// GraphQL proxy
app.use('/graphql', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('GraphQL Proxy Error:', err);
    res.status(502).send('GraphQL Gateway error!');
  }
}));

// Info proxy
app.use('/info', createProxyMiddleware({
  target: API_HOST,
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Info Proxy Error:', err);
    res.status(502).send('Info Gateway error!');
  }
}));

// Static files from public directory
app.use(express.static(publicPath));

// Source files for development
app.use('/src', express.static(srcPath));

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
        .app-loading {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 300px;
          text-align: center;
        }
        .loader {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #5E35B1;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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
                <a href="/test" class="nav-link">Test Page</a>
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
                <a href="/test" class="nav-link">Test Page</a>
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
                <a href="/test" class="nav-link">Test Page</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="auth-container">
          <h1 class="auth-title">Login</h1>
          <form action="/api/auth/login" method="POST">
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
                <a href="/test" class="nav-link">Test Page</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="auth-container">
          <h1 class="auth-title">Register</h1>
          <form action="/api/auth/register" method="POST">
            <div class="form-group">
              <label class="form-label">Name</label>
              <input type="text" name="name" class="form-input" placeholder="Enter your name" required>
            </div>
            <div class="form-group">
              <label class="form-label">Username</label>
              <input type="text" name="username" class="form-input" placeholder="Choose a username" required>
            </div>
            <div class="form-group">
              <label class="form-label">Email</label>
              <input type="email" name="email" class="form-input" placeholder="Enter your email" required>
            </div>
            <div class="form-group">
              <label class="form-label">Password</label>
              <input type="password" name="password" class="form-input" placeholder="Create a password" required>
            </div>
            <div class="form-group">
              <label class="form-label">Avatar URL (optional)</label>
              <input type="text" name="avatarUrl" class="form-input" placeholder="Enter image URL">
            </div>
            <button type="submit" class="btn">Register</button>
          </form>
          <div class="auth-footer">
            <p>Already have an account? <a href="/login">Login</a></p>
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

// Test page to confirm API connectivity
app.get('/test', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Test Page - HugMeNow</title>
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
        pre {
          background: #f4f4f4;
          padding: 10px;
          border-radius: 4px;
          overflow: auto;
        }
        .result {
          min-height: 100px;
          background: #f9f9f9;
          padding: 15px;
          border-radius: 4px;
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
                <a href="/test" class="nav-link">Test Page</a>
              </li>
            </ul>
          </nav>
        </div>
      </header>

      <main>
        <div class="container" style="padding: 2rem 0;">
          <h1>API Test Page</h1>
          <p>Use this page to test the API connectivity.</p>
          
          <div class="card">
            <h2>API Info</h2>
            <p>Test the connection to the backend API:</p>
            <button id="testApiBtn" class="btn">Test API</button>
            <div id="apiResult" class="result">
              <p>Results will appear here...</p>
            </div>
          </div>
          
          <div class="card">
            <h2>GraphQL Test</h2>
            <p>Test the GraphQL endpoint:</p>
            <button id="testGraphQLBtn" class="btn">Test GraphQL</button>
            <div id="graphqlResult" class="result">
              <p>Results will appear here...</p>
            </div>
          </div>
          
          <div class="card">
            <h2>Environment</h2>
            <p>Server information:</p>
            <div id="envInfo">
              <p>Time: ${new Date().toISOString()}</p>
              <p>Server: Express.js</p>
              <p>Proxying to: ${API_HOST}</p>
            </div>
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
      
      <script>
        // API test
        document.getElementById('testApiBtn').addEventListener('click', async () => {
          const resultElement = document.getElementById('apiResult');
          resultElement.innerHTML = '<p>Testing API connection...</p>';
          
          try {
            const response = await fetch('/info');
            const data = await response.json();
            
            resultElement.innerHTML = '<p>✅ API Connection Successful!</p><pre>' + 
              JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            resultElement.innerHTML = '<p>❌ API Connection Failed:</p><pre>' + 
              error.message + '</pre>';
          }
        });
        
        // GraphQL test
        document.getElementById('testGraphQLBtn').addEventListener('click', async () => {
          const resultElement = document.getElementById('graphqlResult');
          resultElement.innerHTML = '<p>Testing GraphQL connection...</p>';
          
          try {
            const query = \`
            {
              __schema {
                queryType {
                  name
                }
              }
            }
            \`;
            
            const response = await fetch('/graphql', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ query })
            });
            
            const data = await response.json();
            
            resultElement.innerHTML = '<p>✅ GraphQL Connection Successful!</p><pre>' + 
              JSON.stringify(data, null, 2) + '</pre>';
          } catch (error) {
            resultElement.innerHTML = '<p>❌ GraphQL Connection Failed:</p><pre>' + 
              error.message + '</pre>';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Fallback route for SPA-like navigation
app.get('*', (req, res) => {
  res.redirect('/');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).send('Something broke on the server!');
});

// Start the server
console.log(`Starting HugMeNow server on port ${PORT}...`);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`### SERVER LISTENING ON PORT ${PORT} ###`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log(`API proxy configured to: ${API_HOST}`);
});