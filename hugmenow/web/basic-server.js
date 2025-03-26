// A very simple Express server to test connectivity
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 5000;

// Add CORS
app.use(cors());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Add security headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Hello world route
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HugMeNow - Basic Test</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 { color: #5E35B1; }
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
        pre { 
          background: #f4f4f4; 
          padding: 10px; 
          border-radius: 4px;
          overflow: auto;
        }
      </style>
    </head>
    <body>
      <h1>HugMeNow Basic Test Page</h1>
      <div class="card">
        <h2>Server Status</h2>
        <p>✅ Express server is running correctly!</p>
        <p>Server time: ${new Date().toISOString()}</p>
      </div>
      
      <div class="card">
        <h2>Route Testing</h2>
        <p>Try these routes:</p>
        <ul>
          <li><a href="/api-test">/api-test</a> - Test API endpoint</li>
          <li><a href="/env">/env</a> - View environment info</li>
        </ul>
      </div>
      
      <div class="card">
        <h2>What's Next?</h2>
        <p>Once this basic server is confirmed working, we can proceed to integrate React and fix the build issues.</p>
        <a href="/restart" class="btn">Restart Server</a>
      </div>
    </body>
    </html>
  `);
});

// API test route
app.get('/api-test', (req, res) => {
  res.json({
    status: 'success',
    message: 'API endpoint working correctly',
    timestamp: new Date().toISOString(),
    server: 'HugMeNow Test Server'
  });
});

// Environment info route
app.get('/env', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Environment Info</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
        }
        h1 { color: #5E35B1; }
        pre { 
          background: #f4f4f4; 
          padding: 10px; 
          border-radius: 4px;
          overflow: auto;
        }
        .back {
          display: inline-block;
          background: #5E35B1;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <h1>Environment Information</h1>
      <p>Server environment details:</p>
      <pre>
Node Version: ${process.version}
Platform: ${process.platform}
Architecture: ${process.arch}
Hostname: ${process.env.HOSTNAME || 'unknown'}
PORT: ${PORT}
Current Directory: ${process.cwd()}
      </pre>
      <a href="/" class="back">Back to Home</a>
    </body>
    </html>
  `);
});

// Server restart simulation
app.get('/restart', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Server Restart</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          color: #333;
          text-align: center;
        }
        h1 { color: #5E35B1; }
        .loader {
          border: 5px solid #f3f3f3;
          border-top: 5px solid #5E35B1;
          border-radius: 50%;
          width: 50px;
          height: 50px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .back {
          display: inline-block;
          background: #5E35B1;
          color: white;
          padding: 8px 16px;
          border-radius: 4px;
          text-decoration: none;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <h1>Server Restart Simulation</h1>
      <div class="loader"></div>
      <p>This is just a simulation of a server restart.</p>
      <p>In a real scenario, the server would be restarted now.</p>
      <a href="/" class="back">Back to Home</a>
      <script>
        // Simulate server restart with a countdown
        let countdown = 5;
        const updateCountdown = () => {
          document.querySelector('p').textContent = 
            'This is just a simulation of a server restart. Redirecting in ' + countdown + ' seconds...';
          countdown--;
          if (countdown < 0) {
            window.location.href = '/';
          } else {
            setTimeout(updateCountdown, 1000);
          }
        };
        updateCountdown();
      </script>
    </body>
    </html>
  `);
});

// Start the server
console.log(`Starting basic test server on port ${PORT}...`);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`### TEST SERVER LISTENING ON PORT ${PORT} ###`);
  console.log(`Server running on http://0.0.0.0:${PORT}`);
  console.log('Ready for basic connectivity tests!');
});