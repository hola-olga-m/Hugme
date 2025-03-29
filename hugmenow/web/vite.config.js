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
  // Configure preview server to listen on all interfaces (0.0.0.0)
  // and use port 5173 which is mapped to port 80 externally
  preview: {
    port: 5173,
    host: '0.0.0.0'
  }
});