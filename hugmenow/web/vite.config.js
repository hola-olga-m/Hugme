import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', // Make the server accessible externally
    hmr: {
      // Allow HMR from all hosts
      host: '0.0.0.0',
      clientPort: 443, // Use 443 for HTTPS connections
      protocol: 'wss', // Use secure WebSockets
    },
    cors: true, // Enable CORS for all origins
    // Allow all hosts to access the dev server
    strictPort: true,
    fs: {
      // Allow serving files from the entire project
      allow: ['..'],
    },
    // Explicitly allow all hosts
    origin: '*',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // Allow Replit domains
    allowedHosts: ['all', '.replit.dev', '.repl.co'],
    proxy: {
      // Forward API requests to the NestJS server
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Forward GraphQL requests to the NestJS server
      '/graphql': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
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