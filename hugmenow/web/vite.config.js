import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    // Custom plugin to handle SPA routing - serve index.html for any route
    {
      name: 'spa-fallback',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          // Skip API and asset requests
          if (req.url.startsWith('/api') || 
              req.url.startsWith('/info') || 
              req.url.startsWith('/graphql') ||
              req.url.includes('.')) {
            return next();
          }
          
          // For all other routes, send index.html
          const indexPath = path.join(__dirname, 'index.html');
          if (fs.existsSync(indexPath)) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'text/html');
            res.end(fs.readFileSync(indexPath));
            return;
          }
          
          next();
        });
      }
    }
  ],
  server: {
    host: '0.0.0.0',
    port: 3001,
    strictPort: true,
    hmr: {
      clientPort: 443,
      host: 'www.replit.com'
    },
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      },
      '/info': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path
      },
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3001
  },
  build: {
    // This ensures that the app works with client-side routing
    assetsDir: 'assets',
    emptyOutDir: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});