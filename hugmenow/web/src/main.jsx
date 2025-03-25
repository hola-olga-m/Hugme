import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './styles/main.css';

// Store initial path for direct navigation handling
window.__INITIAL_PATH__ = window.location.pathname;

// Log routing information
console.log('📍 Initial path:', window.__INITIAL_PATH__);
console.log('🔗 Base URL:', import.meta.env.VITE_PUBLIC_URL || 'http://localhost:3001');
console.log('🌐 Backend URL:', import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000');

// Function to find and initialize the root element
function initApp() {
  const rootElement = document.getElementById('root');
  
  if (rootElement) {
    console.log('Found root element, initializing React app');
    
    // Create the React app root and render the application
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } else {
    console.error('Root element not found, retrying in 100ms');
    // Retry if the element isn't available yet (rare race condition)
    setTimeout(initApp, 100);
  }
}

// Start the application
initApp();