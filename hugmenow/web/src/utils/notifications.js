/**
 * Notification Utilities
 * Provides functions for displaying various types of notifications
 */

// A simple in-memory store for notification settings
const notificationSettings = {
  enabled: true,
  sound: true,
  desktopNotifications: 'default', // 'granted', 'denied', 'default'
  types: {
    hugs: true,
    requests: true,
    mood: true,
    system: true
  }
};

// Check if the browser supports notifications
const supportsNotifications = () => {
  return 'Notification' in window;
};

// Request permission for desktop notifications
export const requestNotificationPermission = async () => {
  if (!supportsNotifications()) {
    console.log('This browser does not support desktop notifications');
    return false;
  }

  try {
    const permission = await Notification.requestPermission();
    notificationSettings.desktopNotifications = permission;
    return permission === 'granted';
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Show a notification to the user
 * @param {string} title - The title of the notification
 * @param {string} message - The message content
 * @param {Object} options - Additional options
 * @param {string} options.type - The type of notification (info, success, warning, error)
 * @param {boolean} options.desktop - Whether to show a desktop notification
 * @param {number} options.duration - How long to show the notification (ms)
 * @param {Function} options.onClick - Callback when notification is clicked
 */
export const showNotification = (title, message, options = {}) => {
  const { 
    type = 'info', 
    desktop = false, 
    duration = 5000,
    onClick = null
  } = options;
  
  // If notifications are disabled, don't show anything
  if (!notificationSettings.enabled) {
    return;
  }
  
  // First, show an in-app notification
  showInAppNotification(title, message, type, duration, onClick);
  
  // If requested and permission granted, show a desktop notification
  if (desktop && supportsNotifications() && 
      notificationSettings.desktopNotifications === 'granted') {
    showDesktopNotification(title, message, { onClick });
  }
};

/**
 * Show an in-app notification
 * @private
 */
const showInAppNotification = (title, message, type, duration, onClick) => {
  // In a real implementation, this would use a notification library or component
  console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
  
  // Create a custom event that the notification component can listen for
  const event = new CustomEvent('app:notification', {
    detail: {
      title,
      message,
      type,
      duration,
      onClick
    }
  });
  
  // Dispatch the event so notification components can respond
  document.dispatchEvent(event);
};

/**
 * Show a desktop notification
 * @private
 */
const showDesktopNotification = (title, message, options = {}) => {
  if (!supportsNotifications() || 
      Notification.permission !== 'granted') {
    return;
  }
  
  try {
    const notification = new Notification(title, {
      body: message,
      icon: '/favicon.ico' // Use app icon
    });
    
    if (options.onClick && typeof options.onClick === 'function') {
      notification.onclick = (event) => {
        event.preventDefault();
        options.onClick(event);
        notification.close();
      };
    }
    
    // Auto-close after 5 seconds
    setTimeout(() => {
      notification.close();
    }, 5000);
  } catch (error) {
    console.error('Error showing desktop notification:', error);
  }
};

/**
 * Update notification settings
 * @param {Object} settings - New settings
 */
export const updateNotificationSettings = (settings) => {
  Object.assign(notificationSettings, settings);
};

/**
 * Get current notification settings
 */
export const getNotificationSettings = () => {
  return { ...notificationSettings };
};