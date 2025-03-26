/**
 * Animation utility functions and configurations
 * Provides consistent animations across the application
 */

/**
 * Standard animation variants for Framer Motion
 */
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    y: 20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideDown = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    x: -30,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    x: 30,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

export const scale = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

/**
 * Staggered children animations
 */
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    }
  }
};

/**
 * Heart beat pulse animation for hug/like interactions
 */
export const heartbeat = {
  hidden: { scale: 1 },
  visible: {
    scale: [1, 1.2, 1],
    transition: {
      times: [0, 0.5, 1],
      duration: 0.8,
      repeat: 0,
    }
  }
};

/**
 * Notification bell shake animation
 */
export const bellShake = {
  hidden: { rotate: 0 },
  visible: {
    rotate: [0, 15, -15, 10, -10, 5, -5, 0],
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    }
  }
};

/**
 * Page transition animation for route changes
 */
export const pageTransition = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3, ease: "easeIn" }
  }
};

/**
 * Animation variants for mood emojis
 */
export const moodEmoji = {
  hover: {
    scale: 1.2,
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 0.5
    }
  },
  tap: {
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  },
  selected: {
    scale: [1, 1.3, 1],
    backgroundColor: "rgba(94, 114, 228, 0.1)",
    borderColor: "rgba(94, 114, 228, 0.5)",
    transition: {
      duration: 0.5
    }
  }
};

/**
 * Create a custom spring transition
 * @param {number} [stiffness=100] - The stiffness of the spring
 * @param {number} [damping=10] - The damping of the spring
 * @param {number} [mass=1] - The mass of the object
 * @returns {Object} Spring transition configuration
 */
export const springTransition = (stiffness = 100, damping = 10, mass = 1) => ({
  type: "spring",
  stiffness,
  damping,
  mass
});

/**
 * Generate a delay value for staggered animations
 * @param {number} index - The index of the item in the staggered sequence
 * @param {number} [baseDelay=0.1] - The base delay between items
 * @returns {number} The calculated delay value
 */
export const staggerDelay = (index, baseDelay = 0.1) => {
  return index * baseDelay;
};

/**
 * Check if animations should be enabled
 * @returns {boolean} True if animations should be enabled
 */
export const shouldEnableAnimations = () => {
  const storedPreference = localStorage.getItem('useAnimations');
  if (storedPreference !== null) {
    return storedPreference === 'true';
  }
  
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return !prefersReducedMotion;
};

/**
 * Calculate proper animation duration based on user preferences
 * @param {number} duration - Base animation duration
 * @returns {number} Adjusted animation duration
 */
export const getAdjustedDuration = (duration) => {
  if (!shouldEnableAnimations()) {
    return 0.01; // Minimal duration when animations are disabled
  }
  
  const speedFactor = localStorage.getItem('animationSpeed') || 1;
  return duration * speedFactor;
};