/**
 * Minimal Express server for Replit's web application feedback tool
 * This server demonstrates the authentication timeout solutions
 */

const express = require('express');
const app = express();
const PORT = 5000;

// Enable CORS and JSON parsing
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Simple in-memory users for testing
const users = [];

// Endpoints
app.post('/api/register', (req, res) => {
  console.log('Register request received:', req.body);
  
  const userData = req.body.registerInput;
  
  // Basic validation
  if (!userData || !userData.email || !userData.password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create user
  const newUser = {
    id: Date.now().toString(),
    email: userData.email,
    name: userData.name || '',
    username: userData.username || '',
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  
  // Return success with small delay (500ms)
  setTimeout(() => {
    res.status(201).json({
      token: 'test-auth-token-' + newUser.id,
      user: newUser
    });
  }, 500);
});

// Slow register endpoint to demonstrate timeout
app.post('/api/register-slow', (req, res) => {
  console.log('Slow registration request - will delay for 20 seconds');
  // This delay simulates a very slow API response
  setTimeout(() => {
    res.status(201).json({ 
      message: 'This response should never be seen due to timeout',
      error: 'You should never see this due to the client-side timeout' 
    });
  }, 20000);
});

// Serve test UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Auth Timeout Test</title>
      <style>
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          line-height: 1.5;
        }
        .box {
          background: #f5f5f5;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { color: #333; }
        button { 
          padding: 10px 15px; 
          background: #4285f4; 
          color: white; 
          border: none; 
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          margin-right: 10px;
        }
        button:hover { background: #3b78e7; }
        button:disabled { 
          background: #cccccc; 
          cursor: not-allowed; 
        }
        input { 
          padding: 8px; 
          margin-bottom: 10px; 
          width: 100%;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        .error { color: #d32f2f; margin-top: 10px; }
        .success { color: #388e3c; margin-top: 10px; }
        .loading { 
          display: inline-block;
          width: 20px;
          height: 20px;
          border: 3px solid rgba(0, 0, 0, 0.1);
          border-radius: 50%;
          border-top-color: #3498db;
          animation: spin 1s ease infinite;
          margin-left: 10px;
          vertical-align: middle;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <h1>Authentication Timeout Testing</h1>
      
      <div class="box">
        <h2>1. Normal Register (Fast Response)</h2>
        <p>This demonstrates the standard registration flow that completes quickly.</p>
        <div>
          <input id="fast-email" placeholder="Email" value="test@example.com" />
          <input id="fast-password" type="password" placeholder="Password" value="Password123" />
          <button id="fast-register">Register (Fast)</button>
          <span id="fast-loading" class="loading" style="display: none;"></span>
        </div>
        <div id="fast-result"></div>
      </div>
      
      <div class="box">
        <h2>2. Slow Register (Will Timeout)</h2>
        <p>This demonstrates how the timeout mechanism prevents indefinite loading states.</p>
        <div>
          <input id="slow-email" placeholder="Email" value="test@example.com" />
          <input id="slow-password" type="password" placeholder="Password" value="Password123" />
          <button id="slow-register">Register (Slow/Timeout)</button>
          <span id="slow-loading" class="loading" style="display: none;"></span>
        </div>
        <div id="slow-result"></div>
      </div>
      
      <script>
        // Helper function to simulate fetchWithTimeout from our real application
        async function fetchWithTimeout(url, options, timeout = 5000) {
          const controller = new AbortController();
          const id = setTimeout(() => controller.abort(), timeout);
          
          try {
            console.log(\`[API] \${options.method || 'GET'} \${url}\`);
            const response = await fetch(url, {
              ...options,
              signal: controller.signal
            });
            clearTimeout(id);
            
            if (!response.ok) {
              throw new Error(\`HTTP error! Status: \${response.status}\`);
            }
            
            return await response.json();
          } catch (error) {
            clearTimeout(id);
            if (error.name === 'AbortError') {
              throw new Error('Request timed out. Please try again later.');
            }
            throw error;
          }
        }
        
        // Fast registration handler
        document.getElementById('fast-register').addEventListener('click', async () => {
          const email = document.getElementById('fast-email').value;
          const password = document.getElementById('fast-password').value;
          const resultElement = document.getElementById('fast-result');
          const btnElement = document.getElementById('fast-register');
          const loadingElement = document.getElementById('fast-loading');
          
          if (!email || !password) {
            resultElement.innerHTML = '<p class="error">Please enter both email and password</p>';
            return;
          }
          
          // Show loading state
          btnElement.disabled = true;
          loadingElement.style.display = 'inline-block';
          resultElement.innerHTML = '<p>Processing registration...</p>';
          
          try {
            const data = await fetchWithTimeout('/api/register', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registerInput: { email, password }
              })
            });
            
            resultElement.innerHTML = \`
              <p class="success">Registration successful!</p>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (error) {
            resultElement.innerHTML = \`<p class="error">Error: \${error.message}</p>\`;
          } finally {
            btnElement.disabled = false;
            loadingElement.style.display = 'none';
          }
        });
        
        // Slow registration handler (will timeout)
        document.getElementById('slow-register').addEventListener('click', async () => {
          const email = document.getElementById('slow-email').value;
          const password = document.getElementById('slow-password').value;
          const resultElement = document.getElementById('slow-result');
          const btnElement = document.getElementById('slow-register');
          const loadingElement = document.getElementById('slow-loading');
          
          if (!email || !password) {
            resultElement.innerHTML = '<p class="error">Please enter both email and password</p>';
            return;
          }
          
          // Show loading state
          btnElement.disabled = true;
          loadingElement.style.display = 'inline-block';
          resultElement.innerHTML = '<p>Processing registration (will timeout after 5 seconds)...</p>';
          
          try {
            // This will timeout after 5 seconds
            const data = await fetchWithTimeout('/api/register-slow', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                registerInput: { email, password }
              })
            }, 5000); // 5 second timeout
            
            // This should never execute due to timeout
            resultElement.innerHTML = \`
              <p class="success">Registration successful!</p>
              <pre>\${JSON.stringify(data, null, 2)}</pre>
            \`;
          } catch (error) {
            resultElement.innerHTML = \`
              <p class="error">Error: \${error.message}</p>
              <p>This demonstrates how our timeout handling prevents indefinite loading when an API is slow or unresponsive.</p>
            \`;
          } finally {
            btnElement.disabled = false;
            loadingElement.style.display = 'none';
          }
        });
      </script>
    </body>
    </html>
  `);
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Auth feedback test server running at http://0.0.0.0:${PORT}`);
});