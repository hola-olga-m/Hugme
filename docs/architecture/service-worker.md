# Service Worker Implementation

## Overview

HugMood implements a sophisticated service worker (`public/serviceWorker.js`) to enable Progressive Web App (PWA) capabilities including offline functionality, background processing, and push notifications. The service worker acts as a client-side proxy that intercepts network requests and can respond with cached resources when offline.

## Service Worker Features

- **Offline Functionality**: Enables the app to function without an internet connection
- **Cache Management**: Efficiently stores and retrieves resources from the browser's Cache API
- **Background Sync**: Queues operations when offline for later execution
- **Push Notifications**: Receives and displays push notifications
- **Update Management**: Handles service worker updates and cache invalidation
- **Performance Optimization**: Implements various caching strategies for different resource types

## Service Worker Lifecycle

The service worker follows a specific lifecycle that ensures safe application updates:

```
┌─────────────────┐      ┌──────────────┐      ┌───────────────┐
│                 │      │              │      │               │
│    Install      │─────▶│   Waiting    │─────▶│   Activated   │
│                 │      │              │      │               │
└─────────────────┘      └──────────────┘      └───────────────┘
        │                                              │
        ▼                                              ▼
┌─────────────────┐                          ┌───────────────┐
│  Cache Static   │                          │ Handle Fetch  │
│    Resources    │                          │   Events      │
└─────────────────┘                          └───────────────┘
```

### Lifecycle Phases

1. **Registration**: The application registers the service worker during initialization
2. **Install**: The service worker installs and precaches critical resources
3. **Waiting**: If another service worker is active, the new one waits
4. **Activate**: The service worker activates and cleans up old caches
5. **Idle**: The service worker is idle until triggered by events
6. **Terminate**: The browser may terminate the service worker to save memory
7. **Update**: When a new service worker is available, the update cycle begins

## Service Worker Architecture

The service worker implementation is organized into several modular components for maintainability:

### Core Event Handlers

```javascript
// Installation event - precache critical resources
self.addEventListener('install', event => {
  event.waitUntil(
    cacheManager.precacheResources()
      .then(() => self.skipWaiting())
  );
});

// Activation event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      cacheManager.clearOldCaches(),
      self.clients.claim()
    ])
  );
});

// Fetch event - intercept network requests
self.addEventListener('fetch', event => {
  // Apply different strategies based on request type
  event.respondWith(
    cacheManager.handleFetch(event)
  );
});

// Sync event - process background syncs
self.addEventListener('sync', event => {
  if (event.tag === 'sync-mood-updates') {
    event.waitUntil(
      offlineQueueManager.processQueue('mood-updates')
    );
  } else if (event.tag === 'sync-hugs') {
    event.waitUntil(
      offlineQueueManager.processQueue('hugs')
    );
  }
});

// Push event - handle push notifications
self.addEventListener('push', event => {
  event.waitUntil(
    pushNotificationHandler.handlePush(event)
  );
});

// Notification click event - handle notification interactions
self.addEventListener('notificationclick', event => {
  event.waitUntil(
    pushNotificationHandler.handleNotificationClick(event)
  );
});
```

## Cache Strategies

The service worker implements different caching strategies based on the type of resource:

### 1. Cache-First Strategy

Used for static assets that change infrequently:

```javascript
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    // Clone the response before caching it
    cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    // Network failed, no cache available
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
```

### 2. Network-First Strategy

Used for API requests and dynamic content:

```javascript
async function networkFirst(request, options = {}) {
  try {
    // Try the network first
    const networkResponse = await fetch(request);
    
    // Cache the response for offline use
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, networkResponse.clone());
    
    return networkResponse;
  } catch (error) {
    // Network failed, try the cache
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // If specified, return a fallback page for navigation requests
    if (options.fallbackUrl && request.mode === 'navigate') {
      return cache.match(options.fallbackUrl);
    }
    
    // No cache, no fallback
    return new Response('Network error and no cached version available', {
      status: 504,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
```

### 3. Stale-While-Revalidate Strategy

Used for resources that should be updated in the background:

```javascript
async function staleWhileRevalidate(request) {
  const cache = await caches.open(CACHE_NAME);
  
  // Try to get from cache
  const cachedResponse = await cache.match(request);
  
  // Revalidate in the background regardless
  const fetchPromise = fetch(request).then(networkResponse => {
    cache.put(request, networkResponse.clone());
    return networkResponse;
  }).catch(error => {
    console.error('Background fetch failed:', error);
  });
  
  // Return cached response immediately if available
  return cachedResponse || fetchPromise;
}
```

### 4. Network-Only Strategy

Used for non-cacheable requests:

```javascript
async function networkOnly(request) {
  try {
    return await fetch(request);
  } catch (error) {
    return new Response('Network error occurred', {
      status: 408,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
```

### Strategy Selection

The service worker selects the appropriate caching strategy based on the request:

```javascript
/**
 * Determine caching strategy based on request
 * @param {Request} request - The fetch request
 * @return {Promise<Response>} The response
 */
async function determineStrategy(request) {
  const url = new URL(request.url);
  
  // Static assets (CSS, JS, fonts, images)
  if (/\.(js|css|woff2?|ttf|eot|svg|png|jpe?g|gif|webp)$/i.test(url.pathname)) {
    return cacheFirst(request);
  }
  
  // API requests
  if (url.pathname.startsWith('/api/') || url.pathname === '/graphql') {
    return networkFirst(request);
  }
  
  // HTML pages
  if (request.mode === 'navigate' || request.headers.get('Accept').includes('text/html')) {
    return networkFirst(request, {
      // Fallback to offline page if network fails and page not in cache
      fallbackUrl: '/offline.html'
    });
  }
  
  // Default - try network with cache fallback
  return networkFirst(request);
}
```

## Offline Queue Management

The service worker implements a sophisticated queueing system for operations when the application is offline:

```javascript
/**
 * Queue an operation for background sync
 * @param {string} operationType - Type of operation ('mood', 'hug', etc.)
 * @param {Object} data - Operation data
 * @return {Promise<void>}
 */
async function queueOperation(operationType, data) {
  const db = await openDatabase();
  const tx = db.transaction('offline-operations', 'readwrite');
  const store = tx.objectStore('offline-operations');
  
  await store.add({
    id: generateId(),
    timestamp: Date.now(),
    type: operationType,
    data: data,
    attempts: 0,
    status: 'pending'
  });
  
  // Register for sync if supported
  if ('sync' in self.registration) {
    await self.registration.sync.register(`sync-${operationType}s`);
  }
}
```

### Processing the Queue

When connectivity is restored, the service worker processes the queue:

```javascript
/**
 * Process queued operations
 * @param {string} queueName - The queue to process
 * @return {Promise<void>}
 */
async function processQueue(queueName) {
  const db = await openDatabase();
  const tx = db.transaction('offline-operations', 'readwrite');
  const store = tx.objectStore('offline-operations');
  
  // Get operations of specified type
  const operations = await store.index('type').getAll(queueName.replace('sync-', ''));
  
  // Process each operation
  for (const operation of operations) {
    try {
      // Update operation status
      operation.status = 'processing';
      operation.attempts += 1;
      operation.lastAttempt = Date.now();
      await store.put(operation);
      
      // Process based on type
      let result;
      switch (operation.type) {
        case 'mood':
          result = await sendMoodUpdate(operation.data);
          break;
        case 'hug':
          result = await sendHug(operation.data);
          break;
        // Add other operation types here
      }
      
      // Operation succeeded, remove from queue
      await store.delete(operation.id);
      
      // Notify clients about successful sync
      await notifyClientsAboutSync(operation);
      
    } catch (error) {
      // Handle failure
      operation.status = 'failed';
      operation.lastError = error.message;
      
      // Implement retry with backoff if under max attempts
      if (operation.attempts < MAX_RETRY_ATTEMPTS) {
        operation.status = 'pending';
        operation.nextAttempt = Date.now() + calculateBackoff(operation.attempts);
      }
      
      await store.put(operation);
    }
  }
}
```

## Communication with Clients

The service worker communicates with client pages through the PostMessage API:

```javascript
/**
 * Broadcast message to all clients
 * @param {Object} message - Message to broadcast
 * @return {Promise<void>}
 */
async function broadcastMessage(message) {
  const clients = await self.clients.matchAll({
    includeUncontrolled: true,
    type: 'window'
  });
  
  clients.forEach(client => {
    client.postMessage(message);
  });
}

/**
 * Notify clients about new content available
 * @return {Promise<void>}
 */
async function notifyUpdateAvailable() {
  broadcastMessage({
    type: 'UPDATE_AVAILABLE',
    timestamp: Date.now()
  });
}
```

## Push Notifications

The service worker handles push notifications from the server:

```javascript
/**
 * Handle incoming push notification
 * @param {PushEvent} event - The push event
 * @return {Promise<void>}
 */
async function handlePush(event) {
  // Try to get the data from the push event
  let data;
  try {
    data = event.data.json();
  } catch (e) {
    data = {
      title: 'New Notification',
      body: event.data ? event.data.text() : 'No details available'
    };
  }
  
  // Extract notification details
  const title = data.title || 'HugMood Update';
  const options = {
    body: data.body || '',
    icon: data.icon || '/icon-192x192.png',
    badge: data.badge || '/badge-96x96.png',
    data: {
      url: data.url || '/',
      ...data.data
    },
    vibrate: data.vibrate || [100, 50, 100],
    tag: data.tag || 'default'
  };
  
  // Show the notification
  await self.registration.showNotification(title, options);
  
  // Also inform any open clients
  broadcastMessage({
    type: 'PUSH_RECEIVED',
    notification: {
      title, 
      ...options
    }
  });
}

/**
 * Handle notification click event
 * @param {NotificationEvent} event - The notification event
 * @return {Promise<void>}
 */
async function handleNotificationClick(event) {
  event.notification.close();
  
  const urlToOpen = event.notification.data?.url || '/';
  
  // Try to focus an existing window/tab if open
  const windowClients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });
  
  for (const client of windowClients) {
    if (client.url === urlToOpen && 'focus' in client) {
      await client.focus();
      return;
    }
  }
  
  // If no window is already open, open a new one
  if (self.clients.openWindow) {
    await self.clients.openWindow(urlToOpen);
  }
}
```

## Service Worker Registration

The main application registers the service worker during initialization:

```javascript
/**
 * Register the service worker
 * @return {Promise<void>}
 */
async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/serviceWorker.js');
      
      registration.addEventListener('updatefound', () => {
        const installingWorker = registration.installing;
        
        installingWorker.addEventListener('statechange', () => {
          if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New service worker available
            showUpdateNotification();
          }
        });
      });
      
      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener('message', event => {
        handleServiceWorkerMessage(event.data);
      });
      
    } catch (error) {
      console.error('Service worker registration failed:', error);
    }
  }
}
```

## Service Worker Reset

For debugging and recovery purposes, a separate script (`public/sw-reset.js`) is provided to reset the service worker:

```javascript
/**
 * Reset all service workers and caches
 * @return {Promise<boolean>} Success status
 */
async function resetServiceWorkers() {
  if (!('serviceWorker' in navigator)) {
    return false;
  }
  
  try {
    // Get all service worker registrations
    const registrations = await navigator.serviceWorker.getRegistrations();
    
    // Unregister each service worker
    await Promise.all(
      registrations.map(registration => registration.unregister())
    );
    
    // Clear all caches
    const keys = await caches.keys();
    await Promise.all(
      keys.map(key => caches.delete(key))
    );
    
    // Clear IndexedDB databases related to the app
    await clearIndexedDBDatabases();
    
    return true;
  } catch (error) {
    console.error('Failed to reset service workers:', error);
    return false;
  }
}
```

## Testing and Debugging

The service worker includes special considerations for testing and debugging:

```javascript
// Only register service worker in production mode
if (process.env.NODE_ENV === 'production') {
  registerServiceWorker();
} else {
  console.log('Service Worker disabled in development mode');
}

// Development helper for debugging
if (process.env.NODE_ENV === 'development') {
  self.addEventListener('message', event => {
    if (event.data && event.data.type === 'DEBUG_SW') {
      console.log('SW Debug State:', {
        caches: self.caches,
        clients: self.clients,
        registration: self.registration
      });
    }
  });
}
```

## Browser Compatibility

The service worker implementation includes feature detection and fallbacks for browsers with varying levels of support:

```javascript
// Feature detection for various Service Worker APIs
const serviceWorkerSupport = {
  basic: 'serviceWorker' in navigator,
  sync: 'SyncManager' in window,
  periodicSync: 'PeriodicSyncManager' in window,
  push: 'PushManager' in window,
  navigationPreload: 'navigationPreload' in ServiceWorkerRegistration.prototype,
  backgroundFetch: 'BackgroundFetchManager' in self
};

// Adjust functionality based on support
function initializeServiceWorker() {
  if (!serviceWorkerSupport.basic) {
    // Fall back to traditional web app functionality
    return initializeWithoutServiceWorker();
  }
  
  // Register core service worker
  registerServiceWorker();
  
  // Register optional features if supported
  if (serviceWorkerSupport.sync) {
    registerBackgroundSync();
  }
  
  if (serviceWorkerSupport.push) {
    registerPushNotifications();
  }
}
```

## Performance Considerations

The service worker is optimized for performance:

1. **Minimal Installation Phase**: Only critical resources are precached during installation
2. **Navigation Preload**: Starts network requests in parallel with service worker startup
3. **Efficient Cache Management**: Implements size limits and LRU eviction policies
4. **Conditional Background Sync**: Only registers sync operations that are actually needed
5. **Stream Processing**: Uses streaming responses for large resources

## Security Considerations

The service worker implementation includes several security measures:

1. **HTTPS Only**: Service workers only operate on secure origins
2. **Content Security Policy**: Strict CSP to prevent XSS attacks
3. **Origin Checking**: Validates fetch requests against allowlists
4. **Secure Caching**: Avoids caching sensitive information
5. **Safe Update Process**: Carefully manages the update lifecycle to prevent broken states