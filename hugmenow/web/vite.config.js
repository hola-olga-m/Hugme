import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import history from 'connect-history-api-fallback';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'configure-response-headers',
      configureServer: (server) => {
        // Add history API fallback middleware
        server.middlewares.use(
          history({
            // Explicitly specify paths to redirect to index.html
            rewrites: [
              // Avoid serving index.html for API requests and static assets
              { 
                from: /^\/api\/.*$/,
                to: context => context.parsedUrl.pathname
              },
              { 
                from: /^\/info$/,
                to: context => context.parsedUrl.pathname
              },
              { 
                from: /^\/graphql$/,
                to: context => context.parsedUrl.pathname
              },
              // For everything else, serve index.html
              { 
                from: /^\/.*$/,
                to: '/index.html'
              }
            ]
          })
        );
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
    },
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['..']
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
  },
  // Fix for HTML parsing issues
  assetsInclude: ['**/*.html'],
  optimizeDeps: {
    exclude: ['hugmenow-web']
  }
});