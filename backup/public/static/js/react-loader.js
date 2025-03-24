/**
 * React Application Loader
 * 
 * This script handles loading and mounting the React application,
 * ensuring it properly replaces the static landing page.
 */

// Wait for DOM content to be loaded before initializing
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing React application loader');
  
  // Create app state if not exists
  window.APP_STATE = window.APP_STATE || {};
  
  // Wait for GraphQL service to be ready
  if (window.APP_STATE && window.APP_STATE.graphqlReady) {
    initializeReactApp();
  } else {
    console.log('Waiting for GraphQL service to be ready...');
    window.addEventListener('graphqlReady', initializeReactApp);
    
    // Also check for graphql service directly
    if (window.graphqlService && typeof window.graphqlService.initialize === 'function') {
      console.log('GraphQL service found directly, initializing React app');
      initializeReactApp();
    } else {
      // Add a timeout to check again
      setTimeout(function() {
        if (window.graphqlService && typeof window.graphqlService.initialize === 'function') {
          console.log('GraphQL service found after timeout, initializing React app');
          initializeReactApp();
        }
      }, 1000);
    }
  }
});

// Global React initialization flag
window.reactInitializing = false;
window.reactInitialized = false;

// Initialize the React application
function initializeReactApp() {
  // Prevent multiple initializations
  if (window.reactInitializing || window.reactInitialized) {
    console.log('React initialization already in progress or completed');
    return;
  }
  
  window.reactInitializing = true;
  console.log('Initializing React application');
  
  // Create a container for the React test app
  const testContainer = document.createElement('div');
  testContainer.id = 'react-test-container';
  testContainer.style.position = 'fixed';
  testContainer.style.top = '10px';
  testContainer.style.right = '10px';
  testContainer.style.zIndex = '9999';
  testContainer.style.backgroundColor = '#7c5cbf';
  testContainer.style.color = 'white';
  testContainer.style.padding = '10px';
  testContainer.style.borderRadius = '5px';
  testContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  testContainer.innerText = 'React is Loading...';
  document.body.appendChild(testContainer);
  
  // Load the React application script (using fixed version)
  const script = document.createElement('script');
  script.src = '/static/js/fixed-main.chunk.js';  // Use fixed version with no duplicate variable declarations
  script.onload = function() {
    console.log('React application script loaded successfully');
    testContainer.innerText = 'React Loaded Successfully!';
    
    // Add toggle button for static content
    const toggleButton = document.createElement('button');
    toggleButton.style.marginLeft = '10px';
    toggleButton.style.padding = '5px 10px';
    toggleButton.style.backgroundColor = '#fff';
    toggleButton.style.color = '#7c5cbf';
    toggleButton.style.border = 'none';
    toggleButton.style.borderRadius = '3px';
    toggleButton.style.cursor = 'pointer';
    toggleButton.innerText = 'Toggle View';
    
    toggleButton.onclick = function() {
      const staticLanding = document.getElementById('static-landing');
      if (staticLanding) {
        if (staticLanding.style.display === 'none') {
          staticLanding.style.display = 'block';
          this.innerText = 'Show React App';
        } else {
          staticLanding.style.display = 'none';
          this.innerText = 'Show Static Page';
        }
      }
    };
    
    testContainer.appendChild(toggleButton);
    
    // Change background color to indicate success
    testContainer.style.backgroundColor = '#4bb543';
    
    // Mark React as initialized
    window.reactInitialized = true;
    window.reactInitializing = false;
    
    // Dispatch event that React is ready
    const event = new Event('reactReady');
    window.dispatchEvent(event);
  };
  
  script.onerror = function() {
    console.error('Failed to load React application script');
    testContainer.innerText = 'Failed to load React!';
    testContainer.style.backgroundColor = '#ff3b30';
    window.reactInitializing = false;
  };
  
  document.body.appendChild(script);
}

// Log that the loader script has been initialized
console.log('React loader script initialized');