/**
 * Play haptic feedback on devices that support it
 * @param {string} type - Type of haptic feedback (selection, impact, success, warning, error, start)
 */
export const playHapticFeedback = (type = 'selection') => {
  // Check if the device supports vibration
  if (!navigator.vibrate) {
    console.log('Haptic feedback not supported on this device');
    return;
  }
  
  // Define vibration patterns for different feedback types
  const patterns = {
    selection: [50],
    impact: [100],
    success: [50, 30, 50, 30, 50],
    warning: [100, 50, 100],
    error: [100, 50, 100, 50, 100],
    start: [30, 20, 30]
  };
  
  // Get the appropriate pattern or default to selection
  const pattern = patterns[type] || patterns.selection;
  
  // Trigger vibration
  navigator.vibrate(pattern);
};

/**
 * Check if the device supports haptic feedback
 * @returns {boolean} True if haptic feedback is supported
 */
export const isHapticFeedbackSupported = () => {
  return !!navigator.vibrate;
};

/**
 * Play a notification haptic feedback pattern
 * @param {string} notificationType - Type of notification (message, hug, request, group)
 */
export const playNotificationHaptic = (notificationType = 'message') => {
  const notificationPatterns = {
    message: [50, 30, 50],
    hug: [100, 50, 100, 50, 100],
    request: [50, 30, 50, 30, 100],
    group: [30, 20, 30, 20, 30, 20, 100]
  };
  
  const pattern = notificationPatterns[notificationType] || notificationPatterns.message;
  
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Create a custom haptic pattern
 * @param {Array<number>} pattern - Array of durations in ms (vibration, pause, vibration, ...)
 */
export const playCustomHaptic = (pattern) => {
  if (!Array.isArray(pattern) || pattern.length === 0) {
    console.error('Invalid haptic pattern');
    return;
  }
  
  if (navigator.vibrate) {
    navigator.vibrate(pattern);
  }
};

/**
 * Stop any ongoing vibration
 */
export const stopHapticFeedback = () => {
  if (navigator.vibrate) {
    navigator.vibrate(0);
  }
};

export default {
  playHapticFeedback,
  isHapticFeedbackSupported,
  playNotificationHaptic,
  playCustomHaptic,
  stopHapticFeedback
};
