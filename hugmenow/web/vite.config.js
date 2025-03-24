
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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
    // Handle client-side routing - return index.html for all paths
    fs: {
      allow: ['.']
    }
  },
  preview: {
    host: '0.0.0.0',
    port: 3001
  },
  // This is crucial for SPA routing - ensure history API fallback
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  },
  // Important for client-side routing
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});
