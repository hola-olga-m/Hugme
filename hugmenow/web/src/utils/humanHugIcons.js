/**
 * Human Hug Icons Utilities
 * 
 * This module provides utilities for working with human-figured hug icons.
 * It includes constants and helper functions for accessing static and animated icons.
 */

// Hug types based on the reference grid image
export const HUG_TYPES = {
  BEAR_HUG: 'BearHug',
  SUPPORTING: 'Supporting',
  COMFORTING: 'Comforting',
  LOVING: 'Loving',
  CELEBRATING: 'Celebrating',
  FESTIVE: 'Festive',
  CARING: 'Caring',
  TEASING: 'Teasing',
  INVITING: 'Inviting',
  MOODY: 'Moody'
};

// Map of animation types for each hug type
const ANIMATION_TYPES = {
  [HUG_TYPES.BEAR_HUG]: 'breathing',
  [HUG_TYPES.SUPPORTING]: 'breathing',
  [HUG_TYPES.COMFORTING]: 'breathing',
  [HUG_TYPES.LOVING]: 'pulsing',
  [HUG_TYPES.CELEBRATING]: 'bouncing',
  [HUG_TYPES.FESTIVE]: 'bouncing',
  [HUG_TYPES.CARING]: 'breathing',
  [HUG_TYPES.TEASING]: 'breathing',
  [HUG_TYPES.INVITING]: 'breathing',
  [HUG_TYPES.MOODY]: 'breathing'
};

// Function to import all static icons dynamically
function importAllStaticIcons() {
  const hugIcons = {};
  
  // For each hug type, import variants 1-4
  Object.values(HUG_TYPES).forEach(hugType => {
    hugIcons[hugType] = [];
    
    // Each hug type has 4 variants (rows in the grid)
    for (let variant = 1; variant <= 4; variant++) {
      try {
        // Use dynamic import (this works with Vite)
        hugIcons[hugType].push({
          static: `/src/assets/icons/png-icons/${hugType}_${variant}.png`,
          variant
        });
      } catch (error) {
        console.error(`Failed to import icon: ${hugType}_${variant}.png`, error);
      }
    }
  });
  
  return hugIcons;
}

/**
 * Get animation frames for a specific hug icon
 * 
 * @param {string} iconName - The base name of the icon (e.g., "BearHug_1")
 * @param {string} animationType - The type of animation
 * @returns {Array} Array of frame paths
 */
export const getAnimationFrames = (iconName, animationType) => {
  const frames = [];
  // Generate paths for 30 frames
  for (let i = 1; i <= 30; i++) {
    frames.push(`/src/assets/icons/png-icons/${iconName}_frame${i}.png`);
  }
  return frames;
};

/**
 * Determine the animation type for a hug type
 * 
 * @param {string} hugType - The hug type (e.g., "BearHug")
 * @returns {string} The animation type
 */
export const getAnimationType = (hugType) => {
  return ANIMATION_TYPES[hugType] || 'breathing';
};

// Export the static icons
export const HUG_ICONS = importAllStaticIcons();

/**
 * Get animation frames for a specific hug type and variant
 * 
 * @param {string} hugType - The hug type (e.g., "BearHug")
 * @param {number} variant - The variant number (1-4)
 * @returns {Array} Array of animation frame paths
 */
export const getHugAnimationFrames = (hugType, variant = 1) => {
  const iconName = `${hugType}_${variant}`;
  const animationType = getAnimationType(hugType);
  return getAnimationFrames(iconName, animationType);
};