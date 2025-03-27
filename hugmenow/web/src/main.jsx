import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Import and wait for i18n initialization
import i18n from './i18n';

// Find root element to initialize React app
console.log('Found root element, initializing React app');
console.log('i18n ready status:', i18n.isInitialized ? 'Initialized' : 'Not initialized');

// Render the app once i18n is ready
const renderApp = () => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

// If i18n is already initialized, render immediately, otherwise wait for it
if (i18n.isInitialized) {
  renderApp();
} else {
  i18n.on('initialized', () => {
    console.log('i18n initialized event fired');
    renderApp();
  });
}