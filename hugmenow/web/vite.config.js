import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5000,
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
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            console.log('Sending Request:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response:', proxyRes.statusCode, req.url);
          });
        },
      },
      // Forward GraphQL requests to the NestJS server
      '/graphql': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
        ws: true,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('graphql proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            // Add Apollo-specific headers to prevent CSRF issues
            if (req.method === 'POST') {
              proxyReq.setHeader('apollo-require-preflight', 'true');
              
              // Try to extract the operation name from the request body
              if (req.body && req.body.operationName) {
                proxyReq.setHeader('x-apollo-operation-name', req.body.operationName);
              }
            }
            console.log('GraphQL Proxy Request:', req.method, req.url);
          });
        },
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept, Authorization, apollo-require-preflight, x-apollo-operation-name',
        }
      },
      // Forward authentication requests
      '/login': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      '/register': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      '/anonymous-login': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      '/me': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      // Forward user-related requests
      '/users': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      // Forward mood-related requests
      '/moods': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
      },
      // Forward hug-related requests
      '/hugs': {
        target: 'http://0.0.0.0:3000',
        changeOrigin: true,
        secure: false,
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
      output: {
        manualChunks: {
          // Ensure key components are properly chunked
          'animal-hug-gallery': [
            './src/components/AnimalHugGallery/index.js',
            './src/pages/AnimalHugGalleryDemo/index.js',
            './src/utils/animalsHugIcons.js'
          ],
          'hug-icons': [
            './src/components/HugIcon/index.js',
            './src/utils/hugIcons.js'
          ]
        }
      }
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
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'styled-components',
      'framer-motion'
    ],
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
});