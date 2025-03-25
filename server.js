// Basic Express server for HugMeNow - Root directory version
const express = require('express');
const app = express();
const path = require('path');
const PORT = 5000;

// Basic middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Serve a basic landing page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HugMeNow</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
          margin: 0;
          background-color: #f7f8fc;
          padding: 20px;
        }
        .container {
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 40px;
          max-width: 600px;
          width: 100%;
          text-align: center;
        }
        .logo {
          font-size: 48px;
          margin-bottom: 20px;
        }
        h1 {
          color: #4361ee;
          margin-top: 0;
          margin-bottom: 16px;
        }
        p {
          color: #4f4f4f;
          line-height: 1.6;
          margin-bottom: 30px;
        }
        .status {
          background-color: #f0f2ff;
          border-radius: 8px;
          padding: 15px;
          font-size: 14px;
          color: #666;
          margin-top: 30px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🤗</div>
        <h1>HugMeNow</h1>
        <p>Your emotional wellness platform is now online!</p>
        <div class="status">
          <p><strong>Server:</strong> Running on port ${PORT}</p>
          <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
        </div>
      </div>
    </body>
    </html>
  `);
});

// Health check endpoint 
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

// Add a static file directory to serve content
app.use(express.static(path.join(__dirname, 'public')));

// Catch all unmatched routes
app.use((req, res) => {
  res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});

// Heartbeat for monitoring
setInterval(() => {
  console.log(`Server heartbeat: ${new Date().toISOString()}`);
}, 5000);