const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const history = require('connect-history-api-fallback');

// Create Express server
const app = express();

// Enable CORS
app.use(cors());

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[EXPRESS] Received request: ${req.method} ${req.originalUrl}`);
  next();
});

// Basic status endpoint
app.get('/status', (req, res) => {
  res.json({
    status: 'ok',
    service: 'HugMeNow Frontend',
    timestamp: new Date().toISOString()
  });
});

// Proxy API requests to the NestJS server
app.use('/api', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/' // rewrite path
  }
}));

// Proxy GraphQL requests to the NestJS server
app.use('/graphql', createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    console.log(`[EXPRESS] Proxying GraphQL request: ${req.method} ${req.url} -> NestJS backend`);
  }
}));

// Enable history API fallback for React Router
// This middleware should be placed AFTER API routes but BEFORE static files
app.use(history({
  verbose: true,
  rewrites: [
    // Don't rewrite API/GraphQL requests
    { 
      from: /^\/(api|graphql|status)\/.*$/,
      to: context => context.parsedUrl.pathname
    }
  ]
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Create a React app entry point if it doesn't exist
const indexHtmlPath = path.join(__dirname, 'public', 'index.html');
const reactAppHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>HugMeNow</title>
    <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
    <style>
        body {
            font-family: 'Roboto', sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f5f5f5;
        }
        #root {
            min-height: 100vh;
        }
        .auth-page {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #f5f8fa;
        }
        .auth-form-container {
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 2rem;
            width: 100%;
            max-width: 400px;
        }
        .auth-title {
            color: #4a90e2;
            margin-top: 0;
            margin-bottom: 0.5rem;
        }
        .auth-subtitle {
            color: #666;
            margin-top: 0;
            margin-bottom: 2rem;
        }
        .auth-form .form-group {
            margin-bottom: 1rem;
        }
        .auth-form label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
        }
        .auth-form input {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
            box-sizing: border-box;
        }
        .btn {
            display: inline-block;
            border: none;
            padding: 0.75rem 1.5rem;
            text-decoration: none;
            text-align: center;
            font-size: 1rem;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.3s;
            font-weight: 500;
        }
        .btn-block {
            display: block;
            width: 100%;
        }
        .btn-primary {
            background-color: #4a90e2;
            color: white;
        }
        .btn-primary:hover {
            background-color: #357abd;
        }
        .btn-outline {
            background-color: transparent;
            border: 1px solid #4a90e2;
            color: #4a90e2;
        }
        .btn-outline:hover {
            background-color: #f0f7ff;
        }
        .auth-divider {
            margin: 1.5rem 0;
            text-align: center;
            position: relative;
        }
        .auth-divider::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 0;
            right: 0;
            height: 1px;
            background-color: #eee;
            z-index: 1;
        }
        .auth-divider span {
            position: relative;
            background-color: white;
            padding: 0 1rem;
            color: #999;
            z-index: 2;
        }
        .auth-links {
            margin-top: 1.5rem;
            text-align: center;
        }
        .auth-links a {
            color: #4a90e2;
            text-decoration: none;
        }
        .error-message {
            background-color: #ffebee;
            color: #d32f2f;
            padding: 0.75rem;
            border-radius: 4px;
            margin-bottom: 1.5rem;
        }
        .auth-language-switcher {
            position: absolute;
            top: 1rem;
            right: 1rem;
        }
        @media (max-width: 480px) {
            .auth-form-container {
                border-radius: 0;
                box-shadow: none;
                padding: 1.5rem;
            }
        }
    </style>
</head>
<body>
    <div id="root">
        <div class="auth-page">
            <div class="auth-form-container">
                <h2 class="auth-title">HugMeNow</h2>
                <p class="auth-subtitle">Your emotional wellness companion</p>
                <h3>Login</h3>
                <form class="auth-form">
                    <div class="form-group">
                        <label for="email">Email</label>
                        <input type="email" id="email" required />
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" required />
                    </div>
                    <button type="button" class="btn btn-primary btn-block">Login</button>
                </form>
                <div class="auth-divider">
                    <span>or continue with</span>
                </div>
                <button class="btn btn-outline btn-block">Anonymous Login</button>
                <div class="auth-links">
                    <p>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </div>
        </div>
    </div>
    <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script>
        // This is a placeholder script until we properly build and bundle the React app
        console.log('HugMeNow app loaded in development mode');
        
        // Simple React component to test React is loading properly
        const LoginForm = () => {
            const [email, setEmail] = React.useState('');
            const [password, setPassword] = React.useState('');
            
            const handleLogin = (e) => {
                e.preventDefault();
                console.log('Login attempt with:', email);
                alert('Login functionality coming soon!');
            };
            
            return React.createElement('div', { className: 'auth-page' },
                React.createElement('div', { className: 'auth-form-container' },
                    React.createElement('h2', { className: 'auth-title' }, 'HugMeNow'),
                    React.createElement('p', { className: 'auth-subtitle' }, 'Your emotional wellness companion'),
                    React.createElement('h3', null, 'Login'),
                    React.createElement('form', { className: 'auth-form', onSubmit: handleLogin },
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'email' }, 'Email'),
                            React.createElement('input', { 
                                type: 'email', 
                                id: 'email',
                                value: email,
                                onChange: (e) => setEmail(e.target.value),
                                required: true 
                            })
                        ),
                        React.createElement('div', { className: 'form-group' },
                            React.createElement('label', { htmlFor: 'password' }, 'Password'),
                            React.createElement('input', { 
                                type: 'password', 
                                id: 'password',
                                value: password,
                                onChange: (e) => setPassword(e.target.value),
                                required: true 
                            })
                        ),
                        React.createElement('button', { 
                            type: 'submit',
                            className: 'btn btn-primary btn-block'
                        }, 'Login')
                    ),
                    React.createElement('div', { className: 'auth-divider' },
                        React.createElement('span', null, 'or continue with')
                    ),
                    React.createElement('button', { 
                        className: 'btn btn-outline btn-block',
                        onClick: () => alert('Anonymous login coming soon!')
                    }, 'Anonymous Login'),
                    React.createElement('div', { className: 'auth-links' },
                        React.createElement('p', null,
                            'Don\'t have an account? ',
                            React.createElement('a', { href: '/register' }, 'Register')
                        )
                    )
                )
            );
        };
        
        // Mount React component to test
        const rootElement = document.getElementById('root');
        if (rootElement) {
            ReactDOM.render(React.createElement(LoginForm), rootElement);
        }
    </script>
</body>
</html>`;

// Handle all other routes - serve the React app entry point
app.get('*', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.send(reactAppHtml);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running on port ${PORT}`);
  console.log(`- Serving static files from: ${path.join(__dirname, 'public')}`);
  console.log(`- API proxy to: http://localhost:3000`);
});