/**
 * Haptic Feedback Utilities
 * Provides functions for creating haptic feedback on devices that support it
 */

// Check if the device supports vibration
const supportsVibration = () => {
  return 'navigator' in window && 'vibrate' in navigator;
};

// Check if the device supports haptic feedback via Web Haptics API
const supportsHaptics = () => {
  return 'navigator' in window && 'haptics' in navigator;
};

/**
 * Play a haptic feedback pattern
 * @param {string} pattern - The type of feedback (success, error, warning, selection)
 */
export const playHapticFeedback = (pattern = 'selection') => {
  try {
    // Different vibration patterns based on the type of feedback
    const patterns = {
      success: [100, 30, 100], // Two short vibrations
      error: [300, 100, 300, 100, 300], // Three long vibrations
      warning: [200, 100, 200], // Two medium vibrations
      selection: [50], // A short vibration
      hug: [50, 30, 50, 30, 50, 100, 150] // Custom hug pattern
    };
    
    const selectedPattern = patterns[pattern] || patterns.selection;
    
    // Use the Web Haptics API if available (more precise control)
    if (supportsHaptics() && typeof navigator.haptics.vibrate === 'function') {
      navigator.haptics.vibrate(selectedPattern);
    } 
    // Fall back to the Vibration API
    else if (supportsVibration()) {
      navigator.vibrate(selectedPattern);
    } 
    // No haptic feedback available
    else {
      console.log('Haptic feedback not supported on this device');
    }
  } catch (error) {
    console.error('Error playing haptic feedback:', error);
  }
};

/**
 * Stop any ongoing vibration
 */
export const stopHapticFeedback = () => {
  if (supportsVibration()) {
    navigator.vibrate(0); // Stop any ongoing vibration
  }
};

/**
 * Check if haptic feedback is available on this device
 * @returns {boolean} Whether haptic feedback is supported
 */
export const isHapticFeedbackAvailable = () => {
  return supportsVibration() || supportsHaptics();
};