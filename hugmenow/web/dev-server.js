
// Simple development server script for Vite
const { createServer } = require('vite');
const path = require('path');

async function startViteServer() {
  try {
    console.log('Starting Vite development server...');
    
    const server = await createServer({
      configFile: path.resolve(__dirname, 'vite.config.js'),
      root: __dirname,
      server: {
        port: 5000,
        host: '0.0.0.0',
        hmr: {
          clientPort: 443,
          host: '0.0.0.0',
          protocol: 'wss'
        }
      }
    });
    
    await server.listen();
    
    console.log(`
Vite server running at:
  - Local: http://localhost:5000/
  - Network: http://0.0.0.0:5000/
  - Replit: ${process.env.REPL_SLUG ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co` : 'Check your Replit URL'}
    `);
    
    ['SIGINT', 'SIGTERM'].forEach(signal => {
      process.on(signal, () => {
        console.log(`\nShutting down Vite server...`);
        server.close().then(() => process.exit(0));
      });
    });
    
  } catch (error) {
    console.error('Error starting Vite server:', error);
    process.exit(1);
  }
}

startViteServer();
