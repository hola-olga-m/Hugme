// React bundle.js
console.log('Bundle.js loaded');

// React v18 initialization
document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root');
  if (root) {
    console.log('Found root element, initializing React app');
    
    // Create a link to CSS
    const cssLink = document.createElement('link');
    cssLink.rel = 'stylesheet';
    cssLink.href = '/static/css/main.chunk.css';
    document.head.appendChild(cssLink);
    
    // Load main script
    const mainScript = document.createElement('script');
    mainScript.src = '/static/js/main.chunk.js';
    mainScript.onload = () => console.log('Main chunk loaded');
    mainScript.onerror = (e) => console.error('Error loading main chunk:', e);
    document.body.appendChild(mainScript);
  } else {
    console.error('Root element not found!');
  }
});