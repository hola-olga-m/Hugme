import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Find root element to initialize React app
console.log('Found root element, initializing React app');

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);