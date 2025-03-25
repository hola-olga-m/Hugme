import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import history from 'connect-history-api-fallback';
import fs from 'fs';

// Load environment variables
export default defineConfig(({ command, mode }) => {
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
  
  // Create the dist directory if it doesn't exist (for the _redirects file)
  if (command === 'build' && !fs.existsSync('./dist')) {
    fs.mkdirSync('./dist', { recursive: true });
  }
  
  return {
    // Build Configuration
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      emptyOutDir: true,
      sourcemap: true,
      minify: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'index.html'),
        },
        output: {
          entryFileNames: 'assets/[name].[hash].js',
          chunkFileNames: 'assets/[name].[hash].js',
          assetFileNames: 'assets/[name].[hash].[ext]',
          manualChunks(id) {
            // Create a vendor chunk with common dependencies
            if (id.includes('node_modules')) {
              if (id.includes('react') || 
                  id.includes('react-dom') || 
                  id.includes('react-router') || 
                  id.includes('@apollo') || 
                  id.includes('i18next')) {
                return 'vendor';
              }
              
              // Split other node_modules into separate chunks
              const moduleName = id.toString().split('node_modules/')[1].split('/')[0].toString();
              return `vendor-${moduleName}`;
            }
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
      port: 5000, // Use the same port as our express server
      strictPort: true
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
      // Create a dummy script to force page to load
      {
        name: 'ensure-js-entry',
        enforce: 'pre',
        generateBundle(options, bundle) {
          // Create a simple entry script if none exists
          if (!fs.existsSync('./src/main.jsx')) {
            console.warn('Creating temporary entry script to ensure proper bundling');
            bundle['dummy-entry.js'] = {
              type: 'asset',
              fileName: 'assets/dummy-entry.js',
              source: 'console.log("HugMeNow App Entry Point");',
              needsCodeReference: false
            };
          }
        }
      },
      // Fix index.html output location and create _redirects file
      {
        name: 'fix-index-html-location',
        enforce: 'post',
        generateBundle(options, bundle) {
          console.log('Bundle keys:', Object.keys(bundle));
          
          // Find the HTML asset in the bundle
          const htmlAssets = Object.keys(bundle).filter(key => key.endsWith('.html'));
          console.log('HTML Assets:', htmlAssets);
          
          // If there's an index HTML asset being moved to assets/
          const indexHtmlAsset = htmlAssets.find(key => key.includes('index-') && key.startsWith('assets/'));
          
          if (indexHtmlAsset) {
            console.log(`Found index HTML asset: ${indexHtmlAsset}`);
            // Get the HTML content
            let htmlContent = bundle[indexHtmlAsset].source;
            
            // Fix the script reference in the HTML (from /src/main.jsx to the actual build path)
            const jsAssets = Object.keys(bundle).filter(key => 
              key.endsWith('.js') && !key.endsWith('.map') && !key.includes('_redirects')
            );
            console.log('JS Assets:', jsAssets);
            
            // Find the main.js file
            const mainJsAsset = jsAssets.find(key => key.includes('main.') || key.includes('index.'));
            const vendorJsAsset = jsAssets.find(key => key.includes('vendor.'));
            
            if (mainJsAsset) {
              console.log(`Found main JS asset: ${mainJsAsset}`);
              // Replace the script reference in the HTML
              htmlContent = htmlContent.replace(
                '<script type="module" src="/src/main.jsx"></script>',
                `<script type="module" src="/${mainJsAsset}"></script>${vendorJsAsset ? `\n<script type="module" src="/${vendorJsAsset}"></script>` : ''}`
              );
            } else {
              console.warn('Could not find main JS asset in bundle');
              // Add fallback loader script
              htmlContent = htmlContent.replace(
                '</head>',
                `<script type="module">
                  console.log('HugMeNow application initializing via fallback loader');
                  import React from 'react';
                  import ReactDOM from 'react-dom/client';
                  const root = ReactDOM.createRoot(document.getElementById('root'));
                  root.render(React.createElement('div', null, 'HugMeNow App Loading...'));
                </script></head>`
              );
            }
            
            // Create a new asset for the root index.html
            bundle['index.html'] = {
              type: 'asset',
              fileName: 'index.html',
              source: htmlContent,
              needsCodeReference: false
            };
            
            // Also create a _redirects file for SPA routing
            bundle['_redirects'] = {
              type: 'asset',
              fileName: '_redirects',
              source: '/* /index.html 200',
              needsCodeReference: false
            };
          } else {
            console.warn('Could not find index HTML asset in asset/ directory');
            
            // If no index.html is found in assets/, create one from scratch
            const rootIndexHtml = htmlAssets.find(key => key === 'index.html');
            if (rootIndexHtml) {
              console.log('Found root index.html, will use that');
            } else {
              console.log('Creating index.html from scratch');
              bundle['index.html'] = {
                type: 'asset',
                fileName: 'index.html',
                source: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <title>HugMeNow - Emotional Wellness Platform</title>
    <style>
      body { font-family: 'Arial', sans-serif; margin: 0; padding: 0; }
      .app-loading { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }
    </style>
  </head>
  <body>
    <div id="root">
      <div class="app-loading">
        <h2>HugMeNow</h2>
        <p>Loading application...</p>
      </div>
    </div>
    <script>console.log('HugMeNow app is starting...');</script>
  </body>
</html>`,
                needsCodeReference: false
              };
            }
            
            // Create a _redirects file for SPA routing
            bundle['_redirects'] = {
              type: 'asset',
              fileName: '_redirects',
              source: '/* /index.html 200',
              needsCodeReference: false
            };
          }
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
      include: ['react', 'react-dom', 'react-router-dom', '@apollo/client', 'i18next'],
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