
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.{jsx,js}", // Enable JSX in .js files
  })],
  server: {
    port: 5000,
    host: '0.0.0.0',
    hmr: {
      clientPort: 443, // Use Replit's HTTPS port
      host: '0.0.0.0',
      protocol: 'wss', // Use secure WebSockets for Replit
      overlay: true
    },
    cors: true,
    open: false, // Don't open browser automatically
    fs: {
      strict: false,
      allow: ['..']
    },
    // Allow all hosts to connect to the development server
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'http://localhost:3004', // Updated to API_PORT in start-hugmenow-comprehensive.sh
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/graphql': {
        target: 'http://localhost:3004', // Updated to API_PORT in start-hugmenow-comprehensive.sh
        changeOrigin: true,
        secure: false
      },
      '/auth': {
        target: 'http://localhost:3004', // Updated to API_PORT in start-hugmenow-comprehensive.sh
        changeOrigin: true,
        secure: false
      },
      '/postgraphile': {
        target: 'http://localhost:5003', // Updated to match our new POSTGRAPHILE_PORT
        changeOrigin: true,
        secure: false
      },
      '/postgres': {
        target: 'http://localhost:5006', // Updated to match our new DIRECT_POSTGRES_PROXY_PORT
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src')
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
        '.ts': 'tsx',
      },
      jsxFactory: 'React.createElement',
      jsxFragment: 'React.Fragment',
    },
    include: [
      'react',
      'react-dom',
      'react-router-dom',
    ],
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      }
    }
  }
});
// vite.config.js
export default {
  // Configure preview server to listen on all interfaces (0.0.0.0)
  // and use port 5173 which is mapped to port 80 externally
  preview: {
    port: 5173,
    host: '0.0.0.0'
  }
}
