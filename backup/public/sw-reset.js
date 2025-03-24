// Script to reset the service worker
(function() {
  'use strict';
  
  // Check if Service Worker is supported
  if ('serviceWorker' in navigator) {
    console.log('Service Worker Reset Tool: Starting...');
    
    // Unregister all service workers
    navigator.serviceWorker.getRegistrations()
      .then(registrations => {
        console.log('Service Worker Reset Tool: Found', registrations.length, 'service worker registrations');
        
        const unregisterPromises = registrations.map(registration => {
          console.log('Service Worker Reset Tool: Unregistering service worker at scope:', registration.scope);
          return registration.unregister();
        });
        
        return Promise.all(unregisterPromises);
      })
      .then(results => {
        const successCount = results.filter(Boolean).length;
        console.log('Service Worker Reset Tool: Successfully unregistered', successCount, 'service workers');
        
        // Clear all caches
        if ('caches' in window) {
          return caches.keys().then(cacheNames => {
            console.log('Service Worker Reset Tool: Found', cacheNames.length, 'caches to clear');
            return Promise.all(cacheNames.map(cacheName => {
              console.log('Service Worker Reset Tool: Deleting cache:', cacheName);
              return caches.delete(cacheName);
            }));
          });
        }
        return Promise.resolve();
      })
      .then(() => {
        console.log('Service Worker Reset Tool: All caches cleared');
        console.log('Service Worker Reset Tool: Reloading page to register new service worker...');
        
        // Reload the page to register the new service worker
        window.location.reload();
      })
      .catch(error => {
        console.error('Service Worker Reset Tool: Error during reset process:', error);
      });
  } else {
    console.log('Service Worker Reset Tool: Service Workers are not supported in this browser');
  }
})();