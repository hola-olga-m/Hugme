
/**
 * Theme service to manage dynamic theming based on user's mood
 */

// Map mood groups to theme classes
const moodToThemeMap = {
  happy: 'bg-happy',
  joyful: 'bg-happy',
  excited: 'bg-happy',
  content: 'bg-peaceful',
  peaceful: 'bg-peaceful',
  relaxed: 'bg-peaceful',
  neutral: 'bg-neutral',
  tired: 'bg-neutral',
  bored: 'bg-neutral',
  anxious: 'bg-anxious',
  stressed: 'bg-anxious',
  sad: 'bg-sad',
  depressed: 'bg-sad',
  angry: 'bg-anxious'
};

/**
 * Apply a theme based on user's current mood
 * @param {string} mood - The user's current mood
 * @param {HTMLElement} element - Optional element to apply theme to (defaults to document.body)
 */
export const applyMoodTheme = (mood, element = document.body) => {
  if (!mood) return;
  
  // Remove all existing mood background classes
  const bgClasses = Object.values(moodToThemeMap);
  element.classList.remove(...bgClasses);
  
  // Add the appropriate class for this mood
  const themeClass = moodToThemeMap[mood.toLowerCase()] || 'bg-neutral';
  element.classList.add(themeClass);
  
  // Update CSS variables for theme-consistent UI elements
  updateThemeColors(mood);
};

/**
 * Update CSS variables based on mood
 * @param {string} mood - The user's current mood
 */
const updateThemeColors = (mood) => {
  const root = document.documentElement;
  
  switch(moodToThemeMap[mood.toLowerCase()]) {
    case 'bg-happy':
      root.style.setProperty('--accent-color', '#FF5E7D');
      root.style.setProperty('--accent-light', '#FF8CA3');
      break;
    case 'bg-peaceful':
      root.style.setProperty('--accent-color', '#48BFE3');
      root.style.setProperty('--accent-light', '#64DFDF');
      break;
    case 'bg-sad':
      root.style.setProperty('--accent-color', '#8D99AE');
      root.style.setProperty('--accent-light', '#A0B1CC');
      break;
    case 'bg-anxious':
      root.style.setProperty('--accent-color', '#FFC6FF');
      root.style.setProperty('--accent-light', '#FFADAD');
      break;
    default:
      // Reset to default theme colors
      root.style.setProperty('--accent-color', '#7C5CBF');
      root.style.setProperty('--accent-light', '#9879D9');
  }
};

/**
 * Get theme class for a specific mood
 * @param {string} mood - The mood to get theme for
 * @returns {string} CSS class for the mood
 */
export const getMoodThemeClass = (mood) => {
  return moodToThemeMap[mood.toLowerCase()] || 'bg-neutral';
};

export default {
  applyMoodTheme,
  getMoodThemeClass
};
