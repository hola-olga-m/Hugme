import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePluginFonts } from 'vite-plugin-fonts';
import { resolve } from 'path';

// Load environment variables
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  
  // Get the backend API URL from environment
  const apiUrl = env.VITE_BACKEND_URL || 'http://localhost:3000';
  
  console.log(`API URL: ${apiUrl}`);
  console.log(`Public URL: ${env.VITE_PUBLIC_URL || 'http://localhost:3001'}`);
  
  // Define our client-side routes
  const CLIENT_ROUTES = [
    '/login',
    '/register',
    '/dashboard',
    '/mood-tracker',
    '/hug-center',
    '/profile'
  ];
  
  return {
    // Build Configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom', 'react-router-dom'],
            i18n: ['i18next', 'react-i18next'],
            graphql: ['graphql', '@apollo/client'],
          }
        }
      }
    },
    
    // Dev Server Configuration
    server: {
      host: '0.0.0.0',
      port: 3001,
      strictPort: true,
      
      // Special configuration for Replit
      hmr: {
        clientPort: process.env.REPLIT_SLUG || process.env.REPL_ID ? 443 : undefined,
        host: process.env.REPLIT_SLUG || process.env.REPL_ID ? 'www.replit.com' : undefined,
      },
      
      // CORS configuration
      cors: true,
      
      // Proxies for API calls
      proxy: {
        '/api': {
          target: apiUrl,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
          secure: false,
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
          }
        },
        '/graphql': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/info': {
          target: apiUrl,
          changeOrigin: true,
          secure: false
        },
        '/login': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          method: 'POST'
        },
        '/register': {
          target: apiUrl,
          changeOrigin: true,
          secure: false,
          method: 'POST'
        }
      }
    },
    
    // Preview Server Configuration
    preview: {
      host: '0.0.0.0',
      port: 3001
    },
    
    // Resolve Configuration
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    
    // Plugins Configuration
    plugins: [
      react(),
      VitePluginFonts({
        google: {
          families: ['Inter', 'Roboto', 'Open Sans']
        }
      }),
      {
        name: 'html-transform',
        transformIndexHtml: (html) => {
          return html.replace(
            /<title>(.*?)<\/title>/,
            `<title>HugMeNow - Emotional Wellness Platform</title>`
          );
        }
      },
      {
        name: 'client-side-routing',
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            const url = req.url.split('?')[0];
            
            // Skip API requests
            if (url.startsWith('/api') || 
                url.startsWith('/graphql') || 
                url.startsWith('/info') ||
                url.startsWith('/assets')) {
              return next();
            }
            
            // If this is a client-side route, serve the index.html
            if (CLIENT_ROUTES.some(route => url.startsWith(route))) {
              console.log(`Rewriting client route ${url} to index.html`);
              req.url = '/index.html';
            }
            
            next();
          });
        }
      }
    ],
    
    // Include HTML files in assets
    assetsInclude: ['**/*.html'],
    
    // Dependencies optimization
    optimizeDeps: {
      esbuildOptions: {
        define: {
          global: 'globalThis'
        }
      },
      exclude: ['hugmenow-web']
    },
    
    // Define environment variables to pass to the client app
    define: {
      'process.env': {
        VITE_PUBLIC_URL: JSON.stringify(env.VITE_PUBLIC_URL || 'http://localhost:3001'),
        VITE_BACKEND_URL: JSON.stringify(apiUrl),
      }
    }
  };
});