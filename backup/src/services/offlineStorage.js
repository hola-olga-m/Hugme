/**
 * Offline Storage Service
 * 
 * Provides IndexedDB-backed storage for offline app functionality and data persistence.
 */

const DB_NAME = 'hugmood_offline_db';
const DB_VERSION = 1;

/**
 * Open the IndexedDB database
 * @returns {Promise<IDBDatabase>} Database instance
 */
export const openDatabase = () => {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      console.error("Your browser doesn't support IndexedDB");
      reject(new Error("IndexedDB not supported"));
      return;
    }
    
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onerror = (event) => {
      console.error("Database error:", event.target.error);
      reject(event.target.error);
    };
    
    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };
    
    // Create object stores when database is first created or version is upgraded
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      // Object store for user data (mood history, badges, etc.)
      if (!db.objectStoreNames.contains('userData')) {
        const userDataStore = db.createObjectStore('userData', { keyPath: 'id', autoIncrement: true });
        userDataStore.createIndex('type', 'type', { unique: false });
        userDataStore.createIndex('timestamp', 'timestamp', { unique: false });
      }
      
      // Object store for queued messages (actions to sync when back online)
      if (!db.objectStoreNames.contains('outbox')) {
        const outboxStore = db.createObjectStore('outbox', { keyPath: 'id', autoIncrement: true });
        outboxStore.createIndex('timestamp', 'timestamp', { unique: false });
        outboxStore.createIndex('type', 'type', { unique: false });
        outboxStore.createIndex('status', 'status', { unique: false });
      }
      
      // Object store for app settings
      if (!db.objectStoreNames.contains('appSettings')) {
        db.createObjectStore('appSettings', { keyPath: 'key' });
      }
      
      // Object store for cached API responses
      if (!db.objectStoreNames.contains('apiCache')) {
        const apiCacheStore = db.createObjectStore('apiCache', { keyPath: 'url' });
        apiCacheStore.createIndex('timestamp', 'timestamp', { unique: false });
        apiCacheStore.createIndex('expiry', 'expiry', { unique: false });
      }
    };
  });
};

/**
 * Store user data locally
 * @param {string} dataType - Type of data (e.g., 'mood_history', 'hugs')
 * @param {Object} data - Data to store
 * @returns {Promise<boolean>} Success status
 */
export const storeUserData = async (dataType, data) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('userData', 'readwrite');
      const store = transaction.objectStore('userData');
      
      // Create a record with type, data, and timestamp
      const record = {
        type: dataType,
        data: data,
        timestamp: Date.now(),
        userId: data.userId || null
      };
      
      // Use the type as key for updating existing data
      const getRequest = store.index('type').get(dataType);
      
      getRequest.onsuccess = (event) => {
        const existing = event.target.result;
        let request;
        
        if (existing) {
          // Update existing record
          record.id = existing.id;
          request = store.put(record);
        } else {
          // Create new record
          request = store.add(record);
        }
        
        request.onsuccess = () => resolve(true);
        request.onerror = (e) => reject(e.target.error);
      };
      
      getRequest.onerror = (e) => reject(e.target.error);
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error(`Error storing ${dataType}:`, error);
    return false;
  }
};

/**
 * Retrieve user data
 * @param {string} dataType - Type of data to retrieve
 * @returns {Promise<Object|null>} The retrieved data or null if not found
 */
export const getUserData = async (dataType) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('userData', 'readonly');
      const store = transaction.objectStore('userData');
      const index = store.index('type');
      const request = index.get(dataType);
      
      request.onsuccess = (event) => {
        const record = event.target.result;
        resolve(record ? record.data : null);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error(`Error retrieving ${dataType}:`, error);
    return null;
  }
};

/**
 * Queue an action to be performed when back online
 * @param {Object} action - The action to queue
 * @returns {Promise<number>} ID of the queued action
 */
export const queueAction = async (action) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('outbox', 'readwrite');
      const store = transaction.objectStore('outbox');
      
      const record = {
        ...action,
        timestamp: Date.now(),
        status: 'pending'
      };
      
      const request = store.add(record);
      
      request.onsuccess = (event) => {
        resolve(event.target.result);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error queueing action:', error);
    throw error;
  }
};

/**
 * Get all pending actions from the outbox
 * @returns {Promise<Array>} Array of pending actions
 */
export const getPendingActions = async () => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('outbox', 'readonly');
      const store = transaction.objectStore('outbox');
      const index = store.index('status');
      const request = index.getAll('pending');
      
      request.onsuccess = (event) => {
        resolve(event.target.result || []);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error getting pending actions:', error);
    return [];
  }
};

/**
 * Mark an action as processed
 * @param {number} actionId - ID of the action
 * @param {string} status - New status ('completed', 'failed')
 * @returns {Promise<boolean>} Success status
 */
export const updateActionStatus = async (actionId, status) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('outbox', 'readwrite');
      const store = transaction.objectStore('outbox');
      const request = store.get(actionId);
      
      request.onsuccess = (event) => {
        const record = event.target.result;
        if (record) {
          record.status = status;
          record.processedAt = Date.now();
          
          const updateRequest = store.put(record);
          updateRequest.onsuccess = () => resolve(true);
          updateRequest.onerror = (e) => reject(e.target.error);
        } else {
          resolve(false);
        }
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error updating action status:', error);
    return false;
  }
};

/**
 * Store app settings
 * @param {string} key - Setting key
 * @param {any} value - Setting value
 * @returns {Promise<boolean>} Success status
 */
export const storeSetting = async (key, value) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('appSettings', 'readwrite');
      const store = transaction.objectStore('appSettings');
      
      const record = { key, value, updatedAt: Date.now() };
      const request = store.put(record);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error storing setting:', error);
    return false;
  }
};

/**
 * Retrieve app setting
 * @param {string} key - Setting key
 * @returns {Promise<any>} Setting value or null if not found
 */
export const getSetting = async (key) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('appSettings', 'readonly');
      const store = transaction.objectStore('appSettings');
      const request = store.get(key);
      
      request.onsuccess = (event) => {
        const record = event.target.result;
        resolve(record ? record.value : null);
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error retrieving setting:', error);
    return null;
  }
};

/**
 * Cache API response for offline use
 * @param {string} url - Request URL
 * @param {Object} response - API response
 * @param {number} ttl - Time to live in milliseconds
 * @returns {Promise<boolean>} Success status
 */
export const cacheApiResponse = async (url, response, ttl = 3600000) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('apiCache', 'readwrite');
      const store = transaction.objectStore('apiCache');
      
      const now = Date.now();
      const record = {
        url,
        response,
        timestamp: now,
        expiry: now + ttl
      };
      
      const request = store.put(record);
      
      request.onsuccess = () => resolve(true);
      request.onerror = (event) => reject(event.target.error);
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error caching API response:', error);
    return false;
  }
};

/**
 * Get cached API response
 * @param {string} url - Request URL
 * @param {boolean} respectExpiry - Whether to respect cache expiry
 * @returns {Promise<Object|null>} Cached response or null if not found/expired
 */
export const getCachedApiResponse = async (url, respectExpiry = true) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('apiCache', 'readonly');
      const store = transaction.objectStore('apiCache');
      const request = store.get(url);
      
      request.onsuccess = (event) => {
        const record = event.target.result;
        
        if (!record) {
          resolve(null);
          return;
        }
        
        const now = Date.now();
        
        if (respectExpiry && record.expiry < now) {
          // Cache expired
          resolve(null);
        } else {
          resolve(record.response);
        }
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error retrieving cached API response:', error);
    return null;
  }
};

/**
 * Clear expired cache entries
 * @returns {Promise<number>} Number of entries cleared
 */
export const clearExpiredCache = async () => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction('apiCache', 'readwrite');
      const store = transaction.objectStore('apiCache');
      const index = store.index('expiry');
      const now = Date.now();
      
      // Get all expired entries
      const range = IDBKeyRange.upperBound(now);
      const request = index.openCursor(range);
      
      let count = 0;
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        
        if (cursor) {
          // Delete this entry
          store.delete(cursor.primaryKey);
          count++;
          cursor.continue();
        } else {
          resolve(count);
        }
      };
      
      request.onerror = (event) => {
        reject(event.target.error);
      };
      
      transaction.oncomplete = () => {
        db.close();
      };
    });
  } catch (error) {
    console.error('Error clearing expired cache:', error);
    return 0;
  }
};

/**
 * Clear all stored data (for logout or reset)
 * @param {Array} stores - Specific stores to clear, or all if empty
 * @returns {Promise<boolean>} Success status
 */
export const clearAllData = async (stores = []) => {
  try {
    const db = await openDatabase();
    return new Promise((resolve, reject) => {
      const storesToClear = stores.length > 0 ? 
        stores : 
        Array.from(db.objectStoreNames);
      
      const transaction = db.transaction(storesToClear, 'readwrite');
      
      let completed = 0;
      let hasError = false;
      
      storesToClear.forEach(storeName => {
        const store = transaction.objectStore(storeName);
        const request = store.clear();
        
        request.onsuccess = () => {
          completed++;
          if (completed === storesToClear.length && !hasError) {
            resolve(true);
          }
        };
        
        request.onerror = (event) => {
          hasError = true;
          reject(event.target.error);
        };
      });
      
      transaction.oncomplete = () => {
        db.close();
        if (!hasError) {
          resolve(true);
        }
      };
      
      transaction.onerror = (event) => {
        reject(event.target.error);
      };
    });
  } catch (error) {
    console.error('Error clearing data:', error);
    return false;
  }
};