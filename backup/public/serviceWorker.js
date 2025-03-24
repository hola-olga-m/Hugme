
// Service Worker for HugMood App
const CACHE_NAME = 'hugmood-cache-v2';

// Files to cache for offline use
const filesToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/static/css/main.css',
  '/static/css/main.chunk.css',
  '/static/js/bundle.js',
  '/static/js/main.chunk.js',
  '/static/js/fixed-main.chunk.js',
  '/static/js/graphql-bridge.js',
  '/static/js/graphql-config.js',
  '/static/js/cache-control.js',
  '/static/js/common.js',
  '/static/js/react-loader.js',
  '/manifest.json',
  '/favicon.ico'
];

// Install event - cache app shell files
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Install');
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(filesToCache);
      })
      .catch(error => {
        console.error('[ServiceWorker] Cache install error:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Activate');
  
  const cleanupPromise = caches.keys()
    .then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key);
            return caches.delete(key);
          }
        })
      );
    })
    .catch(error => {
      console.error('[ServiceWorker] Cache cleanup error:', error);
    });
    
  event.waitUntil(cleanupPromise);
  return self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip for GraphQL requests to ensure we don't cache them
  if (event.request.url.includes('/graphql')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return response from cache if available
        if (response) {
          return response;
        }
        
        // Clone the request to avoid consuming it
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response to avoid consuming it
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then(cache => {
                // Add response to cache
                cache.put(event.request, responseToCache);
              })
              .catch(error => {
                console.error('[ServiceWorker] Error putting in cache:', error);
              });
            
            return response;
          })
          .catch(error => {
            console.error('[ServiceWorker] Fetch error:', error);
            // If fetch fails, serve offline page for navigation requests
            if (event.request.mode === 'navigate' || 
                (event.request.method === 'GET' && 
                 event.request.headers.get('accept').includes('text/html'))) {
              return caches.match('/offline.html');
            }
            
            // For other resources, just propagate the error
            throw error;
          });
      })
  );
});

// Handle messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.action === 'CLEAR_CACHE') {
    console.log('[ServiceWorker] Clearing cache by request');
    
    const clearCachePromise = caches.keys()
      .then(keyList => {
        return Promise.all(keyList.map(key => caches.delete(key)));
      })
      .then(() => {
        return caches.open(CACHE_NAME);
      })
      .then(cache => {
        return cache.addAll(filesToCache);
      })
      .then(() => {
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ result: 'SUCCESS' });
        }
      })
      .catch(error => {
        console.error('[ServiceWorker] Clear cache error:', error);
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage({ result: 'ERROR', error: error.message });
        }
      });
      
    event.waitUntil(clearCachePromise);
  }
});

// Background sync for pending operations
self.addEventListener('sync', event => {
  if (event.tag === 'sync-mood-data') {
    event.waitUntil(syncMoodData());
  } else if (event.tag === 'sync-sent-hugs') {
    event.waitUntil(syncSentHugs());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  if (!event.data) return;

  try {
    const data = event.data.json();
    const options = {
      body: data.message,
      icon: '/img/hug-notification-icon.png',
      badge: '/img/badge-icon.png',
      vibrate: [100, 50, 100],
      data: {
        url: data.url || '/'
      }
    };

    event.waitUntil(
      self.registration.showNotification('HugMood', options)
    );
  } catch (e) {
    console.error('Error showing notification:', e);
  }
});

// Notification click
self.addEventListener('notificationclick', event => {
  event.notification.close();

  if (event.notification.data && event.notification.data.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  }
});

// Helper functions for sync operations
async function syncMoodData() {
  // Implement mood data sync logic
  console.log('Syncing mood data...');
}

async function syncSentHugs() {
  // Implement sent hugs sync logic
  console.log('Syncing sent hugs...');
}

// Helper function to open indexed DB (retained from original code)
function openDB(name, version) {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(name, version);
    
    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains('offline-hugs')) {
        db.createObjectStore('offline-hugs', { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains('offline-moods')) {
        db.createObjectStore('offline-moods', { keyPath: 'id' });
      }
    };
    
    request.onsuccess = e => resolve(e.target.result);
    request.onerror = e => reject(e.target.error);
  });
}