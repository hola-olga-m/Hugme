
/**
 * Cache Control utility
 * Helps manage the browser cache for the HugMood application
 */

// Function to clear the application cache
function clearAppCache() {
  return new Promise((resolve, reject) => {
    // Check if Service Worker is available
    if ('serviceWorker' in navigator && 'MessageChannel' in window) {
      const messageChannel = new MessageChannel();
      
      // Set up message handler
      messageChannel.port1.onmessage = event => {
        if (event.data.result === 'SUCCESS') {
          console.log('Cache cleared successfully');
          resolve(true);
        } else {
          console.error('Failed to clear cache');
          reject(new Error('Cache clearing failed'));
        }
      };
      
      // Find active service worker and send message
      navigator.serviceWorker.ready
        .then(registration => {
          registration.active.postMessage(
            { action: 'CLEAR_CACHE' },
            [messageChannel.port2]
          );
        })
        .catch(error => {
          console.error('Error accessing Service Worker:', error);
          reject(error);
        });
    } else {
      // Fallback for browsers without Service Worker
      try {
        if ('caches' in window) {
          // Clear all caches using Cache API
          caches.keys().then(names => {
            names.forEach(name => {
              caches.delete(name);
            });
          });
          resolve(true);
        } else {
          console.warn('Cache API not supported');
          resolve(false);
        }
      } catch (error) {
        console.error('Error clearing cache:', error);
        reject(error);
      }
    }
  });
}

// Function to reload application after cache clear
function refreshApplication() {
  clearAppCache()
    .then(() => {
      console.log('Reloading application after cache clear');
      window.location.reload(true);
    })
    .catch(error => {
      console.error('Failed to clear cache, forcing reload', error);
      window.location.reload(true);
    });
}

// Expose functions to window
window.clearAppCache = clearAppCache;
window.refreshApplication = refreshApplication;

// Add refresh button to UI if needed
document.addEventListener('DOMContentLoaded', () => {
  // Check if refresh button container exists
  const container = document.getElementById('refresh-container');
  if (container) {
    const refreshButton = document.createElement('button');
    refreshButton.textContent = 'Refresh App';
    refreshButton.className = 'refresh-button';
    refreshButton.addEventListener('click', refreshApplication);
    container.appendChild(refreshButton);
  }
});

console.log('Cache control utilities loaded');
