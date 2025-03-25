// Simple Express server for HugMeNow
const express = require('express');
const path = require('path');

// Create Express app
const app = express();
const PORT = 5000;

// Middleware for request logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// Parse JSON request bodies
app.use(express.json());

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'HugMeNow API'
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'HugMeNow API',
    version: '0.1.0',
    description: 'Emotional wellness platform API',
    endpoints: {
      '/api/health': 'Health check endpoint',
      '/api/info': 'API information',
      '/api/users': 'User management (coming soon)',
      '/api/moods': 'Mood tracking (coming soon)',
      '/api/hugs': 'Virtual hugs (coming soon)'
    }
  });
});

// Main route - landing page
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
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
        .buttons {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 12px;
          margin-bottom: 30px;
        }
        .button {
          background-color: #4361ee;
          color: white;
          border: none;
          padding: 12px 24px;
          border-radius: 6px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .button:hover {
          background-color: #3347b8;
          transform: translateY(-2px);
        }
        .status {
          background-color: #f0f2ff;
          border-radius: 8px;
          padding: 15px;
          font-size: 14px;
          color: #666;
          margin-top: 30px;
        }
        .status p {
          margin: 5px 0;
        }
        .api-test {
          margin-top: 20px;
          padding: 10px;
          background-color: #f5f5f5;
          border-radius: 8px;
          text-align: left;
        }
        .api-response {
          font-family: monospace;
          white-space: pre;
          overflow-x: auto;
          padding: 10px;
          background-color: #f0f0f0;
          border-radius: 4px;
        }
        .feature {
          background-color: #f8f9fe;
          border-radius: 8px;
          padding: 15px;
          margin-bottom: 15px;
          text-align: left;
        }
        .feature h3 {
          color: #4361ee;
          margin-top: 0;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">🤗</div>
        <h1>HugMeNow</h1>
        <p>Your emotional wellness platform for virtual support, mood tracking, and connecting with others.</p>
        
        <div class="feature">
          <h3>🧠 Mood Tracking</h3>
          <p>Record and visualize your emotional wellness journey with intuitive tools.</p>
        </div>
        
        <div class="feature">
          <h3>👋 Virtual Hugs</h3>
          <p>Send and receive virtual support from your network, no matter where they are.</p>
        </div>
        
        <div class="feature">
          <h3>👥 Community Connection</h3>
          <p>Find supportive communities for shared experiences and growth.</p>
        </div>
        
        <div class="buttons">
          <button class="button" onclick="alert('Feature coming soon!')">Login</button>
          <button class="button" onclick="alert('Feature coming soon!')">Mood Tracker</button>
          <button class="button" onclick="alert('Feature coming soon!')">Send a Hug</button>
        </div>
        
        <div class="status">
          <p><strong>Server:</strong> Running on port ${PORT}</p>
          <p><strong>Server Time:</strong> ${new Date().toISOString()}</p>
        </div>
        
        <div class="api-test">
          <h3>API Status</h3>
          <div class="api-response" id="api-response">Loading API status...</div>
        </div>
      </div>
      
      <script>
        console.log("HugMeNow app loaded");
        
        // Test API endpoint
        fetch('/api/health')
          .then(response => response.json())
          .then(data => {
            document.getElementById('api-response').textContent = JSON.stringify(data, null, 2);
            console.log("API health check:", data);
          })
          .catch(error => {
            document.getElementById('api-response').textContent = "Error connecting to API: " + error.message;
            console.error("API connection error:", error);
          });
      </script>
    </body>
    </html>
  `);
});

// Routes for additional pages
app.get('/mood-tracker', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Mood Tracker - HugMeNow</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f7f8fc;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 30px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        .logo-emoji {
          font-size: 30px;
          margin-right: 10px;
        }
        h1 {
          color: #4361ee;
          margin: 0;
        }
        .mood-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 15px;
          margin: 30px 0;
        }
        .mood-option {
          aspect-ratio: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background-color: #f8f9fe;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .mood-option:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .mood-emoji {
          font-size: 32px;
          margin-bottom: 5px;
        }
        .mood-label {
          font-size: 14px;
          color: #555;
        }
        .back-link {
          display: inline-block;
          margin-top: 20px;
          color: #4361ee;
          text-decoration: none;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .coming-soon {
          text-align: center;
          padding: 40px 0;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <a href="/" class="logo">
            <span class="logo-emoji">🤗</span>
            <h1>HugMeNow</h1>
          </a>
        </header>
        
        <h2>Mood Tracker</h2>
        <p>How are you feeling today?</p>
        
        <div class="mood-grid">
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😊</div>
            <div class="mood-label">Happy</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😌</div>
            <div class="mood-label">Calm</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😐</div>
            <div class="mood-label">Neutral</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😕</div>
            <div class="mood-label">Confused</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😞</div>
            <div class="mood-label">Sad</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😠</div>
            <div class="mood-label">Angry</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">😴</div>
            <div class="mood-label">Tired</div>
          </div>
          <div class="mood-option" onclick="alert('Mood tracking coming soon!')">
            <div class="mood-emoji">🤩</div>
            <div class="mood-label">Excited</div>
          </div>
        </div>
        
        <div class="coming-soon">
          <p>Full mood tracking functionality coming soon!</p>
        </div>
        
        <a href="/" class="back-link">← Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/hug-center', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Hug Center - HugMeNow</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f7f8fc;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 30px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        .logo-emoji {
          font-size: 30px;
          margin-right: 10px;
        }
        h1 {
          color: #4361ee;
          margin: 0;
        }
        .hug-types {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .hug-card {
          background-color: #f8f9fe;
          border-radius: 12px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .hug-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        .hug-emoji {
          font-size: 48px;
          margin-bottom: 10px;
        }
        .hug-title {
          font-size: 18px;
          font-weight: bold;
          color: #4361ee;
          margin-bottom: 5px;
        }
        .hug-description {
          font-size: 14px;
          color: #666;
        }
        .back-link {
          display: inline-block;
          margin-top: 20px;
          color: #4361ee;
          text-decoration: none;
        }
        .back-link:hover {
          text-decoration: underline;
        }
        .coming-soon {
          text-align: center;
          padding: 20px 0;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <a href="/" class="logo">
            <span class="logo-emoji">🤗</span>
            <h1>HugMeNow</h1>
          </a>
        </header>
        
        <h2>Hug Center</h2>
        <p>Send virtual hugs to show your care and support</p>
        
        <div class="hug-types">
          <div class="hug-card" onclick="alert('Sending hugs coming soon!')">
            <div class="hug-emoji">🤗</div>
            <div class="hug-title">Warm Hug</div>
            <div class="hug-description">For comfort and reassurance</div>
          </div>
          
          <div class="hug-card" onclick="alert('Sending hugs coming soon!')">
            <div class="hug-emoji">💪</div>
            <div class="hug-title">Supportive Hug</div>
            <div class="hug-description">For encouragement and strength</div>
          </div>
          
          <div class="hug-card" onclick="alert('Sending hugs coming soon!')">
            <div class="hug-emoji">🎉</div>
            <div class="hug-title">Celebratory Hug</div>
            <div class="hug-description">For achievements and good news</div>
          </div>
          
          <div class="hug-card" onclick="alert('Sending hugs coming soon!')">
            <div class="hug-emoji">❤️</div>
            <div class="hug-title">Loving Hug</div>
            <div class="hug-description">For deep care and affection</div>
          </div>
        </div>
        
        <div class="coming-soon">
          <p>Choose a recipient and write a personalized message (coming soon)</p>
        </div>
        
        <a href="/" class="back-link">← Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>About - HugMeNow</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f7f8fc;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          padding: 30px;
        }
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
        }
        .logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        .logo-emoji {
          font-size: 30px;
          margin-right: 10px;
        }
        h1 {
          color: #4361ee;
          margin: 0;
        }
        h2 {
          color: #4361ee;
          border-bottom: 2px solid #f0f2ff;
          padding-bottom: 10px;
          margin-top: 30px;
        }
        p {
          line-height: 1.6;
          color: #444;
        }
        .feature-list {
          margin: 20px 0;
        }
        .feature-list li {
          margin-bottom: 10px;
        }
        .back-link {
          display: inline-block;
          margin-top: 20px;
          color: #4361ee;
          text-decoration: none;
        }
        .back-link:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <header>
          <a href="/" class="logo">
            <span class="logo-emoji">🤗</span>
            <h1>HugMeNow</h1>
          </a>
        </header>
        
        <h2>About HugMeNow</h2>
        <p>
          HugMeNow is an emotional wellness platform designed to help you track your moods, 
          connect with others, and share emotional support in a safe, digital environment.
        </p>
        
        <h2>Our Mission</h2>
        <p>
          We believe that emotional wellbeing is essential for a balanced, fulfilling life. 
          HugMeNow was created to provide tools and community support for navigating life's 
          emotional journey.
        </p>
        
        <h2>How It Works</h2>
        <p>HugMeNow combines mood tracking with social support features:</p>
        <ul class="feature-list">
          <li><strong>Track your moods</strong> daily to build awareness of your emotional patterns</li>
          <li><strong>Send and receive virtual hugs</strong> to and from friends and family</li>
          <li><strong>Join communities</strong> of people with similar experiences</li>
          <li><strong>View insights</strong> about your emotional wellbeing over time</li>
        </ul>
        
        <h2>Our Team</h2>
        <p>
          Founded by a team of wellness experts, mental health professionals, and technologists, 
          HugMeNow is designed with both scientific research and user experience in mind.
        </p>
        
        <h2>Privacy and Safety</h2>
        <p>
          Your privacy and emotional safety are our top priorities. All data is encrypted, 
          and you have full control over what you share and with whom.
        </p>
        
        <a href="/" class="back-link">← Back to Home</a>
      </div>
    </body>
    </html>
  `);
});

// Catch-all route for any undefined routes
app.get('*', (req, res) => {
  res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HugMeNow Express server running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
});

// Log heartbeat periodically
setInterval(() => {
  console.log(`Server heartbeat at ${new Date().toISOString()}`);
}, 30000);