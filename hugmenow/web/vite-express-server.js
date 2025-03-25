const http = require('http');
const fs = require('fs');
const path = require('path');

// Create a simple HTTP server with minimal dependencies
const PORT = 5000;

// Ensure public directory exists
const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Create a simple HTML file
const indexHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HugMeNow Test Server</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
    h1 { color: #4a4a4a; }
    .content { margin-top: 30px; }
    .nav { display: flex; gap: 15px; margin: 20px 0; }
    .nav a { color: #0066cc; text-decoration: none; font-weight: bold; }
    .login-form, .register-form { border: 1px solid #ddd; padding: 20px; border-radius: 5px; }
    .form-group { margin-bottom: 15px; }
    label { display: block; margin-bottom: 5px; }
    input { width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; }
    button { background: #0066cc; color: white; border: none; padding: 10px 15px; border-radius: 4px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>HugMeNow Server Test</h1>
  <p>This simple server is running on port ${PORT}.</p>
  
  <div class="nav">
    <a href="/">Home</a>
    <a href="/login">Login</a>
    <a href="/register">Register</a>
    <a href="/dashboard">Dashboard</a>
  </div>
  
  <div class="content" id="content">
    <p>Welcome to the HugMeNow testing server!</p>
    <p>The server is correctly configured and running.</p>
  </div>
  
  <script>
    // Simple client-side router to show different content based on path
    const contentDiv = document.getElementById('content');
    const path = window.location.pathname;
    
    if (path === '/login') {
      contentDiv.innerHTML = \`
        <div class="login-form">
          <h2>Login</h2>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password">
          </div>
          <button id="login-btn">Login</button>
        </div>
      \`;
    } else if (path === '/register') {
      contentDiv.innerHTML = \`
        <div class="register-form">
          <h2>Register</h2>
          <div class="form-group">
            <label for="username">Username:</label>
            <input type="text" id="username">
          </div>
          <div class="form-group">
            <label for="email">Email:</label>
            <input type="email" id="email">
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input type="password" id="password">
          </div>
          <div class="form-group">
            <label for="confirm-password">Confirm Password:</label>
            <input type="password" id="confirm-password">
          </div>
          <button id="register-btn">Register</button>
        </div>
      \`;
    } else if (path === '/dashboard') {
      contentDiv.innerHTML = \`
        <h2>Dashboard</h2>
        <p>This is a protected dashboard page.</p>
        <p>You would need to be authenticated to view this in the real app.</p>
      \`;
    }
  </script>
</body>
</html>
`;

// Write the index.html file to the public directory
fs.writeFileSync(path.join(publicDir, 'index.html'), indexHtml);

// Create the HTTP server
const server = http.createServer((req, res) => {
  console.log(`Request: ${req.method} ${req.url}`);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Add a health check endpoint for Replit
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', port: PORT }));
    return;
  }
  
  // Always serve the index.html file for other routes
  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(indexHtml);
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Address: ${JSON.stringify(server.address())}`);
  
  // Log explicit confirmation for Replit
  console.log(`✅ Frontend server ready and listening on http://0.0.0.0:${PORT}`);

  // Register the "listening" event explicitly
  server.on('listening', () => {
    console.log('Server is officially listening!');
  });
  
  // Send a self-request to the health endpoint to confirm server is working
  http.get(`http://localhost:${PORT}/health`, (res) => {
    console.log(`Health check status: ${res.statusCode}`);
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
      console.log(`Health check response: ${data}`);
      // Explicitly emit a listening event for Replit
      server.emit('listening');
    });
  }).on('error', (err) => {
    console.error('Health check failed:', err.message);
  });
});