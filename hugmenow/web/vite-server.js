// Use CommonJS syntax for Replit compatibility
const { createServer } = require('vite');
const path = require('path');

async function startServer() {
  try {
    console.log('Starting Vite server...');
    
    const server = await createServer({
      // Provide the path to vite.config.js
      configFile: path.resolve(__dirname, 'vite.config.js'),
      
      // Use in-built configuration
      server: {
        port: 5000,
        host: '0.0.0.0',
        hmr: {
          clientPort: 443
        }
      },
      
      // Enable logging
      logLevel: 'info',
      
      // Root directory for the project 
      root: __dirname
    });
    
    await server.listen();
    
    const info = server.config.server;
    console.log(`Vite Development Server running at:`);
    console.log(`Local: http://${info.host === '0.0.0.0' ? 'localhost' : info.host}:${info.port}`);
    console.log(`For Replit access, use the WebView tab or your Replit URL`);
    
    // Handle common process exit signals
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        console.log(`Received ${signal}, closing Vite server...`);
        server.close().then(() => process.exit(0));
      });
    });
    
  } catch (error) {
    console.error('Error starting Vite server:', error);
    process.exit(1);
  }
}

startServer();