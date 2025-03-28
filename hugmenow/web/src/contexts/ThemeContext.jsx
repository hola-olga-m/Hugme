import React, { createContext, useState, useContext, useEffect } from 'react';
import { applyMoodTheme, getMoodThemeClass } from '../services/themeService';

// Create context
export const ThemeContext = createContext();

// Custom hook to use theme context
export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light'); // Default theme
  const [moodBasedTheme, setMoodBasedTheme] = useState(false);
  const [currentMood, setCurrentMood] = useState(null);
  const [themePreference, setThemePreference] = useState('auto'); // 'light', 'dark', 'auto', 'mood'

  // Initialize theme from localStorage
  useEffect(() => {
    const storedTheme = localStorage.getItem('hugmood_theme_preference');
    if (storedTheme) {
      setThemePreference(storedTheme);
    }
    
    // Apply initial theme
    applyInitialTheme();
  }, []);

  // Apply theme based on preference
  const applyInitialTheme = () => {
    const preference = localStorage.getItem('hugmood_theme_preference') || 'auto';
    
    switch (preference) {
      case 'light':
        applyLightTheme();
        break;
      case 'dark':
        applyDarkTheme();
        break;
      case 'mood':
        applyMoodBasedTheme();
        break;
      case 'auto':
      default:
        applySystemTheme();
        break;
    }
  };

  // Apply light theme
  const applyLightTheme = () => {
    setTheme('light');
    setMoodBasedTheme(false);
    document.documentElement.setAttribute('data-theme', 'light');
    document.body.classList.remove('dark-theme', 'mood-theme');
    document.body.classList.add('light-theme');
  };

  // Apply dark theme
  const applyDarkTheme = () => {
    setTheme('dark');
    setMoodBasedTheme(false);
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.classList.remove('light-theme', 'mood-theme');
    document.body.classList.add('dark-theme');
  };

  // Apply mood-based theme
  const applyMoodBasedTheme = () => {
    setMoodBasedTheme(true);
    
    // If we have a current mood, apply that theme
    if (currentMood) {
      const moodThemeClass = getMoodThemeClass(currentMood);
      setTheme(`mood-${currentMood}`);
      document.documentElement.setAttribute('data-theme', `mood-${currentMood}`);
      document.body.classList.remove('light-theme', 'dark-theme');
      document.body.classList.add('mood-theme', moodThemeClass);
      
      // Apply mood-specific theme colors
      applyMoodTheme(currentMood);
    } else {
      // Default to light theme if no mood is set
      applyLightTheme();
    }
  };

  // Apply system preference theme
  const applySystemTheme = () => {
    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (isDarkMode) {
      applyDarkTheme();
    } else {
      applyLightTheme();
    }
  };

  // Update theme when mood changes
  useEffect(() => {
    if (moodBasedTheme && currentMood) {
      applyMoodBasedTheme();
    }
  }, [currentMood, moodBasedTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = () => {
      if (themePreference === 'auto') {
        applySystemTheme();
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [themePreference]);

  // Set theme preference
  const changeTheme = (preference) => {
    setThemePreference(preference);
    localStorage.setItem('hugmood_theme_preference', preference);
    
    switch (preference) {
      case 'light':
        applyLightTheme();
        break;
      case 'dark':
        applyDarkTheme();
        break;
      case 'mood':
        applyMoodBasedTheme();
        break;
      case 'auto':
      default:
        applySystemTheme();
        break;
    }
  };

  // Update current mood
  const updateMood = (mood) => {
    setCurrentMood(mood);
    
    // If using mood-based theme, apply the new theme
    if (moodBasedTheme) {
      applyMoodBasedTheme();
    }
  };

  // Context value
  const contextValue = {
    theme,
    themePreference,
    setTheme: changeTheme,
    currentMood,
    updateMood,
    isMoodBased: moodBasedTheme,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;