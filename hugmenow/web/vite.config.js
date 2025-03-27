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
        target: 'http://localhost:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Forward GraphQL requests to the NestJS server
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Forward authentication requests
      '/login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/register': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/anonymous-login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/logout': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      '/me': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Forward user-related requests
      '/users': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Forward mood-related requests
      '/moods': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
      // Forward hug-related requests
      '/hugs': {
        target: 'http://localhost:3000',
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