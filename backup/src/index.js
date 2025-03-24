import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import App from './App';
// Import main styles
import './styles/App.css';
import './styles/Auth.css';
import './styles/Landing.css';
import './styles/AnimatedBackgrounds.css';

// GraphQL client initialization
import * as graphqlService from './services/graphqlService';
import * as graphqlCommunicationClient from './services/graphqlCommunicationClient';

// Simple React component to verify rendering is working
const ReactTestApp = () => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '20px',
      textAlign: 'center'
    }}>
      <h1 style={{color: '#7c5cbf', fontSize: '32px', marginBottom: '20px'}}>
        HugMood React App is Working!
      </h1>
      <p style={{fontSize: '18px', maxWidth: '600px', marginBottom: '30px'}}>
        This overlay confirms that React is rendering correctly with GraphQL.
        The application will now start loading properly.
      </p>
      <button 
        onClick={() => {
          const staticPage = document.getElementById('static-landing');
          if (staticPage) {
            document.getElementById('react-test-wrapper').style.display = 'none';
            staticPage.style.display = 'block';
          }
        }}
        style={{
          padding: '12px 24px',
          backgroundColor: '#7c5cbf',
          color: 'white',
          border: 'none',
          borderRadius: '25px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Continue to App
      </button>
    </div>
  );
};

// Immediately render a test component first to verify React rendering
function renderTestComponent() {
  // Create a wrapper element for our test component
  const testWrapper = document.createElement('div');
  testWrapper.id = 'react-test-wrapper';
  document.body.appendChild(testWrapper);
  
  // Render the test component using the older ReactDOM.render method for maximum compatibility
  ReactDOM.render(<ReactTestApp />, testWrapper);
  
  console.log('React test component rendered successfully');
}

// The main React initialization function
function initializeReact() {
  console.log('Initializing main React application');
  
  const rootElement = document.getElementById('root');
  if (rootElement) {
    console.log('Found root element, initializing React app');
    
    // IMPORTANT: Hide the static landing page when React is initialized
    const staticLanding = document.getElementById('static-landing');
    if (staticLanding) {
      console.log('Hiding static landing page');
      staticLanding.style.display = 'none';
    } else {
      console.warn('Static landing page element not found');
    }

    try {
      // Initialize GraphQL client first
      console.log('Initializing GraphQL client (HTTP only)');
      graphqlService.initialize({
        httpUrl: '/graphql',
        usePollFallback: true
      });
      
      // Create React root and render app
      console.log('Rendering full React application');
      const root = createRoot(rootElement);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
      console.log('React app mounted successfully');
      
      // Remove the test component after the main app is mounted
      const testWrapper = document.getElementById('react-test-wrapper');
      if (testWrapper) {
        setTimeout(() => {
          testWrapper.style.display = 'none';
        }, 5000); // Hide after 5 seconds to ensure app has time to load
      }
    } catch (error) {
      console.error('Failed to initialize React app:', error);
      // Show error message in the root element
      rootElement.innerHTML = `
        <div style="color: red; padding: 20px; text-align: center;">
          <h2>Application Error</h2>
          <p>${error.message}</p>
          <button onclick="window.location.reload()">Reload Page</button>
        </div>
      `;
    }
  } else {
    console.error('Root element (#root) not found');
  }
}

// First render the test component
renderTestComponent();

// Then wait for both DOM and GraphQL to be ready to initialize the main app
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(initializeReact, 0);
} else {
  document.addEventListener('DOMContentLoaded', initializeReact);
}