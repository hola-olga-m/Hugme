import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import history from 'connect-history-api-fallback';

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
      minify: true,
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
              console.log('Proxy error:', err.message);
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
        // Proxy POST requests for login and register
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
      // Title transformation plugin
      {
        name: 'html-transform',
        transformIndexHtml: (html) => {
          return html.replace(
            /<title>(.*?)<\/title>/,
            `<title>HugMeNow - Emotional Wellness Platform</title>`
          );
        }
      },
      // History API fallback for client-side routing
      {
        name: 'client-side-routing',
        configureServer(server) {
          // Add history API fallback middleware
          server.middlewares.use(
            history({
              verbose: true,
              // Explicitly specify paths to redirect to index.html
              rewrites: [
                // Don't rewrite API requests
                { 
                  from: /^\/(api|graphql|info|assets)\/.*$/,
                  to: context => context.parsedUrl.pathname
                },
                // For client routes, serve index.html
                { 
                  from: new RegExp(`^(${CLIENT_ROUTES.join('|')})($|/|\\?)`),
                  to: '/index.html' 
                },
                // For everything else, serve index.html (catch-all for SPA)
                { 
                  from: /^\/.*$/,
                  to: '/index.html'
                }
              ]
            })
          );
          
          // Add request logging
          server.middlewares.use((req, res, next) => {
            console.log(`Request: ${req.method} ${req.url}`);
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