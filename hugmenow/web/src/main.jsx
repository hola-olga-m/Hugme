import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/main.css'

// Log that the app is starting
console.log('HugMeNow app initializing...')

// Add global error handling
window.addEventListener('error', (event) => {
  console.error('Global error caught:', event.error);
});

// Add unhandled promise rejection handling
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// Check for stored initial path from direct navigation
const initialPath = window.__INITIAL_PATH__;
if (initialPath) {
  console.log(`Initial path detected: ${initialPath}`);
}

// Wait for DOM to be fully loaded to ensure #root exists
document.addEventListener('DOMContentLoaded', () => {
  // Set up the root
  const rootElement = document.getElementById('root');
  if (rootElement) {
    try {
      console.log('Found root element, initializing React app');
      
      // Create and render the React root
      const root = ReactDOM.createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App initialPath={initialPath} />
        </React.StrictMode>
      );
      
      console.log('React app rendered successfully');
    } catch (error) {
      console.error('Error rendering React app:', error);
      
      // Fallback in case of render error
      rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
          <h2>Error Loading Application</h2>
          <p>There was a problem loading the HugMeNow application.</p>
          <p>Please try refreshing the page.</p>
          <div style="color: red; margin-top: 10px;">${error.message}</div>
        </div>
      `;
    }
  } else {
    console.error('Root element not found! Make sure there is a div with id="root" in the HTML file.');
    
    // Attempt to create root element if it doesn't exist
    const bodyElement = document.body;
    if (bodyElement) {
      const newRootElement = document.createElement('div');
      newRootElement.id = 'root';
      bodyElement.appendChild(newRootElement);
      
      console.warn('Created missing root element. Attempting to render app...');
      
      // Try rendering to the newly created root
      const root = ReactDOM.createRoot(newRootElement);
      root.render(
        <React.StrictMode>
          <App initialPath={initialPath} />
        </React.StrictMode>
      );
    }
  }
});