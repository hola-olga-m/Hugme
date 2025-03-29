import React, { createContext, useState, useContext, useEffect } from 'react';
import {
  THEMES,
  MOOD_THEMES,
  getCurrentTheme,
  setTheme as setThemeService,
  getMoodBasedThemeEnabled,
  setMoodBasedThemeEnabled,
  applyMoodBasedTheme as applyMoodTheme,
  getMoodThemeClass,
  getAvailableThemes,
  getAvailableMoodThemes,
  toggleDarkMode,
  areAnimationsEnabled,
  setAnimationsEnabled,
  toggleAnimations,
  isReducedMotionEnabled,
  setReducedMotionEnabled,
  isHighContrastEnabled,
  setHighContrastEnabled,
  initializeThemeService
} from '../services/themeService';

// Create context
export const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  // Theme state
  const [theme, setThemeState] = useState(getCurrentTheme()); 
  const [currentMood, setCurrentMood] = useState(null);
  const [animations, setAnimationsState] = useState(areAnimationsEnabled());
  const [reducedMotion, setReducedMotionState] = useState(isReducedMotionEnabled());
  const [highContrast, setHighContrastState] = useState(isHighContrastEnabled());
  const [moodBasedEnabled, setMoodBasedEnabledState] = useState(getMoodBasedThemeEnabled());

  // Initialize theme system
  useEffect(() => {
    initializeThemeService();
    setThemeState(getCurrentTheme());
    setAnimationsState(areAnimationsEnabled());
    setReducedMotionState(isReducedMotionEnabled());
    setHighContrastState(isHighContrastEnabled());
    setMoodBasedEnabledState(getMoodBasedThemeEnabled());
  }, []);

  // Handle theme changes
  const changeTheme = (newTheme) => {
    if (setThemeService(newTheme)) {
      setThemeState(newTheme);
      
      // If changing to something other than mood-based, 
      // update mood-based enabled state
      if (newTheme !== THEMES.MOOD_BASED && moodBasedEnabled) {
        setMoodBasedEnabledState(false);
      } else if (newTheme === THEMES.MOOD_BASED && !moodBasedEnabled) {
        setMoodBasedEnabledState(true);
      }
    }
  };

  // Handle toggling dark mode
  const handleToggleDarkMode = () => {
    toggleDarkMode();
    setThemeState(getCurrentTheme());
  };

  // Handle toggling animations
  const handleToggleAnimations = () => {
    toggleAnimations();
    setAnimationsState(areAnimationsEnabled());
  };

  // Handle setting animations
  const handleSetAnimations = (enabled) => {
    setAnimationsEnabled(enabled);
    setAnimationsState(enabled);
  };

  // Handle setting reduced motion
  const handleSetReducedMotion = (enabled) => {
    setReducedMotionEnabled(enabled);
    setReducedMotionState(enabled);
  };

  // Handle setting high contrast
  const handleSetHighContrast = (enabled) => {
    setHighContrastEnabled(enabled);
    setHighContrastState(enabled);
  };

  // Handle setting mood-based theming
  const handleSetMoodBasedEnabled = (enabled) => {
    setMoodBasedThemeEnabled(enabled);
    setMoodBasedEnabledState(enabled);
    
    if (enabled && currentMood) {
      applyMoodTheme(currentMood);
    }
    
    setThemeState(getCurrentTheme());
  };

  // Handle updating mood
  const updateMood = (mood) => {
    setCurrentMood(mood);
    
    if (moodBasedEnabled) {
      applyMoodTheme(mood);
      setThemeState(getCurrentTheme());
    }
  };

  // Context value
  const contextValue = {
    // Current values
    theme,
    currentMood,
    animationsEnabled: animations,
    reducedMotion,
    highContrast,
    moodBasedThemeEnabled: moodBasedEnabled,
    
    // Setters
    setTheme: changeTheme,
    updateMood,
    toggleDarkMode: handleToggleDarkMode,
    toggleAnimations: handleToggleAnimations,
    setAnimationsEnabled: handleSetAnimations,
    setReducedMotionEnabled: handleSetReducedMotion,
    setHighContrastEnabled: handleSetHighContrast,
    setMoodBasedThemeEnabled: handleSetMoodBasedEnabled,
    
    // Getters
    getAvailableThemes,
    getAvailableMoodThemes,
    getMoodThemeClass,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;