
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  },
  server: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
    hmr: {
      host: '0.0.0.0',
      port: 5173,
      protocol: 'wss'
    }
  },
  preview: {
    port: 5173,
    host: '0.0.0.0',
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    },
    allowedHosts: [
      'hug-network-holaolgam.replit.app',
      '.replit.app',
      'localhost',
      '*'
    ]
  }
});
