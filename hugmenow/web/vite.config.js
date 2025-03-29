import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174,
    host: '0.0.0.0', // Make the server accessible externally
    hmr: {
      // Allow HMR from all hosts
      clientPort: 5174,
      host: '0.0.0.0',
    },
    cors: true, // Enable CORS for all origins
    fs: {
      // Allow serving files from the entire project
      allow: ['..'],
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/graphql': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/auth': {
        target: 'http://localhost:3002',
        changeOrigin: true,
        secure: false,
      },
      '/postgraphile': {
        target: 'http://localhost:3003',
        changeOrigin: true,
        secure: false,
      },
      '/postgres': {
        target: 'http://localhost:3006',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      'mesh-sdk': resolve(__dirname, '../../mesh-sdk'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  esbuild: {
    loader: 'jsx',
    include: /src\/.*\.jsx?$/,
    exclude: [],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});