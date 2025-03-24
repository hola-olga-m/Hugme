const express = require('express');
const fs = require('fs');
const path = require('path');
const history = require('connect-history-api-fallback');
const { createProxyMiddleware } = require('http-proxy-middleware');

async function createServer() {
  const app = express();
  
  // Configure API proxies first (before history API fallback)
  app.use('/api', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }));
  
  app.use('/info', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }));
  
  app.use('/graphql', createProxyMiddleware({
    target: 'http://localhost:3000',
    changeOrigin: true,
    secure: false
  }));
  
  // Apply history API fallback middleware
  app.use(history({
    verbose: true,
    disableDotRule: true,
    rewrites: [
      // Don't rewrite API requests
      {
        from: /^\/api\//,
        to: context => context.parsedUrl.pathname
      },
      {
        from: /^\/info$/,
        to: context => context.parsedUrl.pathname
      },
      {
        from: /^\/graphql$/,
        to: context => context.parsedUrl.pathname
      }
    ]
  }));

  // Serve static files from the dist directory when in production
  // or from public directory in development
  app.use(express.static(path.resolve(__dirname, 'dist')));
  app.use(express.static(path.resolve(__dirname, 'public')));

  // Fallback: direct all other requests to index.html
  app.get('*', (req, res) => {
    console.log(`Serving index.html for: ${req.originalUrl}`);
    // In production, serve from dist/index.html, otherwise serve from root index.html
    const indexPath = fs.existsSync(path.resolve(__dirname, 'dist/index.html')) 
      ? path.resolve(__dirname, 'dist/index.html')
      : path.resolve(__dirname, 'index.html');
    
    try {
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    } catch (e) {
      console.error('Error reading index.html:', e);
      // Fallback HTML if we can't read the index.html file
      res.status(200).set({ 'Content-Type': 'text/html' }).send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Hug Me Now</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" src="/src/main.jsx"></script>
        </body>
        </html>
      `);
    }
  });

  // Start server
  const PORT = 3001;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Configured for SPA with client-side routing support');
  });
}

createServer();