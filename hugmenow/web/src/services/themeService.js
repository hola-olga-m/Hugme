/**
 * Theme Service
 * Manages theme preferences and provides theme-related utilities
 */

// Define available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
  MOOD_BASED: 'mood-based'
};

// Define mood-based themes
export const MOOD_THEMES = {
  HAPPY: 'happy',
  CALM: 'calm',
  SAD: 'sad',
  ANXIOUS: 'anxious',
  ENERGETIC: 'energetic',
  TIRED: 'tired',
  NEUTRAL: 'neutral'
};

// Store the user's theme preference
const THEME_STORAGE_KEY = 'hugmenow_theme_preference';
const ANIMATIONS_STORAGE_KEY = 'hugmenow_animations_enabled';
const REDUCED_MOTION_STORAGE_KEY = 'hugmenow_reduced_motion';
const HIGH_CONTRAST_STORAGE_KEY = 'hugmenow_high_contrast';
const MOOD_THEME_STORAGE_KEY = 'hugmenow_mood_theme_enabled';

/**
 * Get the currently stored theme preference
 * @returns {string} The current theme
 */
export const getCurrentTheme = () => {
  return localStorage.getItem(THEME_STORAGE_KEY) || THEMES.SYSTEM;
};

/**
 * Set the theme preference
 * @param {string} theme - The theme to set
 */
export const setTheme = (theme) => {
  if (Object.values(THEMES).includes(theme)) {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    document.documentElement.setAttribute('data-theme', theme);
    return true;
  }
  return false;
};

/**
 * Get whether the user has enabled mood-based theming
 * @returns {boolean} Whether mood-based theming is enabled
 */
export const getMoodBasedThemeEnabled = () => {
  return localStorage.getItem(MOOD_THEME_STORAGE_KEY) === 'true';
};

/**
 * Set whether mood-based theming is enabled
 * @param {boolean} enabled - Whether to enable mood-based theming
 */
export const setMoodBasedThemeEnabled = (enabled) => {
  localStorage.setItem(MOOD_THEME_STORAGE_KEY, enabled.toString());
  if (enabled) {
    setTheme(THEMES.MOOD_BASED);
  } else {
    // Revert to previous theme or default
    const fallbackTheme = localStorage.getItem('hugmenow_previous_theme') || THEMES.SYSTEM;
    setTheme(fallbackTheme);
  }
};

/**
 * Get the CSS class name for a mood theme
 * @param {string} mood - The mood to get the class for
 * @returns {string} The CSS class name
 */
export const getMoodThemeClass = (mood) => {
  if (!mood) return 'mood-neutral';
  
  const normalizedMood = mood.toLowerCase();
  
  switch (normalizedMood) {
    case 'happy':
      return 'mood-happy';
    case 'calm':
    case 'relaxed':
      return 'mood-calm';
    case 'sad':
    case 'depressed':
    case 'down':
      return 'mood-sad';
    case 'anxious':
    case 'stressed':
    case 'worried':
      return 'mood-anxious';
    case 'energetic':
    case 'excited':
      return 'mood-energetic';
    case 'tired':
    case 'exhausted':
      return 'mood-tired';
    default:
      return 'mood-neutral';
  }
};

/**
 * Apply a theme based on the user's current mood
 * @param {string} mood - The current mood
 */
export const applyMoodBasedTheme = (mood) => {
  // Only apply mood-based theming if it's enabled
  if (!getMoodBasedThemeEnabled()) {
    return;
  }
  
  // Store the current non-mood theme for later
  const currentTheme = getCurrentTheme();
  if (currentTheme !== THEMES.MOOD_BASED) {
    localStorage.setItem('hugmenow_previous_theme', currentTheme);
  }

  // Map the mood to a theme
  let moodTheme;
  switch (mood.toLowerCase()) {
    case 'happy':
      moodTheme = MOOD_THEMES.HAPPY;
      break;
    case 'calm':
    case 'relaxed':
      moodTheme = MOOD_THEMES.CALM;
      break;
    case 'sad':
    case 'depressed':
    case 'down':
      moodTheme = MOOD_THEMES.SAD;
      break;
    case 'anxious':
    case 'stressed':
    case 'worried':
      moodTheme = MOOD_THEMES.ANXIOUS;
      break;
    case 'energetic':
    case 'excited':
      moodTheme = MOOD_THEMES.ENERGETIC;
      break;
    case 'tired':
    case 'exhausted':
      moodTheme = MOOD_THEMES.TIRED;
      break;
    default:
      moodTheme = MOOD_THEMES.NEUTRAL;
  }
  
  // Apply the mood theme
  document.documentElement.setAttribute('data-mood-theme', moodTheme);
  document.documentElement.setAttribute('data-theme', THEMES.MOOD_BASED);
  localStorage.setItem(THEME_STORAGE_KEY, THEMES.MOOD_BASED);
};

/**
 * Get all available themes
 * @returns {Array} Array of theme objects
 */
export const getAvailableThemes = () => {
  return [
    { id: THEMES.LIGHT, name: 'Light' },
    { id: THEMES.DARK, name: 'Dark' },
    { id: THEMES.SYSTEM, name: 'System Default' },
    { id: THEMES.MOOD_BASED, name: 'Mood Based' }
  ];
};

/**
 * Get all available mood themes
 * @returns {Array} Array of mood theme objects
 */
export const getAvailableMoodThemes = () => {
  return [
    { id: MOOD_THEMES.HAPPY, name: 'Happy', color: '#FFD700' },
    { id: MOOD_THEMES.CALM, name: 'Calm', color: '#98DDCA' },
    { id: MOOD_THEMES.SAD, name: 'Sad', color: '#6495ED' },
    { id: MOOD_THEMES.ANXIOUS, name: 'Anxious', color: '#FFA07A' },
    { id: MOOD_THEMES.ENERGETIC, name: 'Energetic', color: '#FF5733' },
    { id: MOOD_THEMES.TIRED, name: 'Tired', color: '#D8BFD8' },
    { id: MOOD_THEMES.NEUTRAL, name: 'Neutral', color: '#E0E0E0' }
  ];
};

/**
 * Toggle between light and dark themes
 */
export const toggleDarkMode = () => {
  const currentTheme = getCurrentTheme();
  
  if (currentTheme === THEMES.DARK) {
    setTheme(THEMES.LIGHT);
  } else {
    setTheme(THEMES.DARK);
  }
};

/**
 * Check if animations should be enabled
 * @returns {boolean} Whether animations are enabled
 */
export const areAnimationsEnabled = () => {
  // Default to true unless explicitly set to false
  return localStorage.getItem(ANIMATIONS_STORAGE_KEY) !== 'false';
};

/**
 * Set whether animations are enabled
 * @param {boolean} enabled - Whether to enable animations
 */
export const setAnimationsEnabled = (enabled) => {
  localStorage.setItem(ANIMATIONS_STORAGE_KEY, enabled.toString());
  
  // Apply to the root element
  if (enabled) {
    document.documentElement.classList.remove('disable-animations');
  } else {
    document.documentElement.classList.add('disable-animations');
  }
};

/**
 * Toggle animations on or off
 */
export const toggleAnimations = () => {
  const currentValue = areAnimationsEnabled();
  setAnimationsEnabled(!currentValue);
};

/**
 * Get whether reduced motion is enabled
 * @returns {boolean} Whether reduced motion is enabled
 */
export const isReducedMotionEnabled = () => {
  // Check user preference first
  const userPref = localStorage.getItem(REDUCED_MOTION_STORAGE_KEY);
  if (userPref !== null) {
    return userPref === 'true';
  }
  
  // Check system preference
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Set whether reduced motion is enabled
 * @param {boolean} enabled - Whether to enable reduced motion
 */
export const setReducedMotionEnabled = (enabled) => {
  localStorage.setItem(REDUCED_MOTION_STORAGE_KEY, enabled.toString());
  
  // Apply to the root element
  if (enabled) {
    document.documentElement.classList.add('reduced-motion');
  } else {
    document.documentElement.classList.remove('reduced-motion');
  }
};

/**
 * Get whether high contrast is enabled
 * @returns {boolean} Whether high contrast is enabled
 */
export const isHighContrastEnabled = () => {
  return localStorage.getItem(HIGH_CONTRAST_STORAGE_KEY) === 'true';
};

/**
 * Set whether high contrast is enabled
 * @param {boolean} enabled - Whether to enable high contrast
 */
export const setHighContrastEnabled = (enabled) => {
  localStorage.setItem(HIGH_CONTRAST_STORAGE_KEY, enabled.toString());
  
  // Apply to the root element
  if (enabled) {
    document.documentElement.classList.add('high-contrast');
  } else {
    document.documentElement.classList.remove('high-contrast');
  }
};

/**
 * Initialize the theme service
 * Sets up initial theme based on preferences
 */
export const initializeThemeService = () => {
  // Apply the stored theme
  const theme = getCurrentTheme();
  document.documentElement.setAttribute('data-theme', theme);
  
  // Apply animations setting
  const animationsEnabled = areAnimationsEnabled();
  if (!animationsEnabled) {
    document.documentElement.classList.add('disable-animations');
  }
  
  // Apply reduced motion setting
  const reducedMotion = isReducedMotionEnabled();
  if (reducedMotion) {
    document.documentElement.classList.add('reduced-motion');
  }
  
  // Apply high contrast setting
  const highContrast = isHighContrastEnabled();
  if (highContrast) {
    document.documentElement.classList.add('high-contrast');
  }
  
  // Apply system theme if using system preference
  if (theme === THEMES.SYSTEM) {
    applySystemTheme();
  }
  
  // Add a listener for system theme changes
  const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  if (darkModeMediaQuery.addEventListener) {
    darkModeMediaQuery.addEventListener('change', (e) => {
      if (getCurrentTheme() === THEMES.SYSTEM) {
        applySystemTheme();
      }
    });
  }
};

/**
 * Apply the system theme based on system preferences
 * @private
 */
const applySystemTheme = () => {
  const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', isDarkMode ? THEMES.DARK : THEMES.LIGHT);
};