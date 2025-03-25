// replit-server.js - A Replit optimized server for HugMeNow frontend
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 5000;

// Serve static files from the public directory
app.use(express.static('public'));

// For Vite-built projects, serve from the dist directory if it exists
app.use(express.static(path.join(__dirname, 'dist')));

// Single page application fallback
app.get('*', (req, res) => {
  // First, try to send the index.html from dist if it exists
  const distIndexPath = path.join(__dirname, 'dist', 'index.html');
  const publicIndexPath = path.join(__dirname, 'public', 'index.html');
  const fallbackPage = path.join(__dirname, 'index.html');
  
  try {
    if (fs.existsSync(distIndexPath)) {
      return res.sendFile(distIndexPath);
    } else if (fs.existsSync(publicIndexPath)) {
      return res.sendFile(publicIndexPath);
    } else if (fs.existsSync(fallbackPage)) {
      return res.sendFile(fallbackPage);
    } else {
      // If no index.html is found, send a basic HTML response
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
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              padding: 20px;
              text-align: center;
              background-color: #f9f9f9;
              color: #333;
            }
            .container {
              max-width: 600px;
              padding: 20px;
              background-color: white;
              border-radius: 8px;
              box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
              color: #4a62b3;
            }
            p {
              line-height: 1.6;
            }
            .status {
              margin-top: 20px;
              font-size: 0.9em;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>HugMeNow App</h1>
            <p>The emotional wellness platform that connects people through virtual support.</p>
            <p>Our server is running, but we're still setting up the frontend application.</p>
            <div class="status">
              <p>Server Status: Running</p>
              <p>Server Time: ${new Date().toISOString()}</p>
              <p>Port: ${PORT}</p>
            </div>
          </div>
          <script>
            console.log("HugMeNow simple server page loaded");
            console.log("Page fully loaded at: " + new Date().toISOString());
          </script>
        </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Error serving index file:', error);
    res.status(500).send('Server Error');
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`HugMeNow frontend running on http://0.0.0.0:${PORT}`);
  console.log(`Server started at: ${new Date().toISOString()}`);
  console.log(`Server is listening on port: ${PORT}`);
  console.log(`Server is bound to address: 0.0.0.0`);
  console.log(`Ready to serve the HugMeNow frontend application`);
});