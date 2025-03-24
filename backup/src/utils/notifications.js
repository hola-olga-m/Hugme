/**
 * Show a notification to the user
 * @param {string} title - The notification title
 * @param {string} body - The notification body text
 * @param {Object} options - Additional notification options
 * @returns {Promise<Notification|null>} The notification object or null if permissions not granted
 */
export const showNotification = async (title, body, options = {}) => {
  // Check if notifications are supported
  if (!('Notification' in window)) {
    console.warn('This browser does not support notifications');
    return null;
  }
  
  // Check if permission is already granted
  if (Notification.permission === 'granted') {
    return createNotification(title, body, options);
  }
  
  // Request permission if not denied
  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    
    if (permission === 'granted') {
      return createNotification(title, body, options);
    }
  }
  
  return null;
};

/**
 * Creates and shows a notification
 * @param {string} title - The notification title
 * @param {string} body - The notification body text
 * @param {Object} options - Additional notification options
 * @returns {Notification} The notification object
 */
const createNotification = (title, body, options = {}) => {
  // Merge default options with provided options
  const notificationOptions = {
    body,
    icon: options.icon || '/favicon.ico',
    badge: options.badge,
    tag: options.tag || 'hug-mood-notification',
    vibrate: options.vibrate || [100, 50, 100],
    data: {
      url: options.url || window.location.origin,
      ...options.data
    },
    ...options
  };
  
  // Create notification
  const notification = new Notification(title, notificationOptions);
  
  // Handle notification click
  notification.onclick = (event) => {
    event.preventDefault();
    
    if (options.onClick) {
      options.onClick(event, notification);
    } else {
      // Default behavior: focus or open the app
      if (options.data && options.data.url) {
        window.open(options.data.url, '_blank');
      } else {
        window.focus();
      }
    }
    
    notification.close();
  };
  
  return notification;
};

/**
 * Schedule a notification to be shown after a delay
 * @param {string} title - The notification title
 * @param {string} body - The notification body text
 * @param {number} delay - The delay in milliseconds
 * @param {Object} options - Additional notification options
 * @returns {number} The timeout ID
 */
export const scheduleNotification = (title, body, delay, options = {}) => {
  return setTimeout(() => {
    showNotification(title, body, options);
  }, delay);
};

/**
 * Check if notification permissions are granted
 * @returns {boolean} True if notifications are supported and permission is granted
 */
export const areNotificationsEnabled = () => {
  return 'Notification' in window && Notification.permission === 'granted';
};

/**
 * Request notification permissions
 * @returns {Promise<string>} The permission status ('granted', 'denied', or 'default')
 */
export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    return await Notification.requestPermission();
  }
  return 'denied';
};

export default {
  showNotification,
  scheduleNotification,
  areNotificationsEnabled,
  requestNotificationPermission
};
