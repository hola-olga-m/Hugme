import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Explicitly define and log an error handling function
function logThemeError(message, details) {
  console.error(`ThemeContext ERROR: ${message}`, details);
}

// Safely define our default palette to ensure it exists
const defaultPalette = {
  id: 'indigo',
  name: 'Modern Indigo',
  colors: {
    primary: '#6366f1', // Enhanced indigo from our CSS vars
    secondary: '#ec4899', // Vibrant pink from our CSS vars
    tertiary: '#14b8a6', // Teal from our CSS vars
    success: '#22c55e', // Enhanced green from our CSS vars
    info: '#3b82f6', // Enhanced blue from our CSS vars
    warning: '#f59e0b', // Enhanced amber from our CSS vars
    danger: '#ef4444', // Enhanced red from our CSS vars
    background: '#f9fafb', // Light gray background
    text: '#111827' // Dark text
  }
};

// Create the theme presets as a simple object
const themePresets = {
  indigo: {
    id: 'indigo',
    name: 'Modern Indigo',
    colors: {
      primary: '#6366f1',
      secondary: '#ec4899',
      tertiary: '#14b8a6',
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  purple: {
    id: 'purple',
    name: 'Royal Purple',
    colors: {
      primary: '#9333ea',
      secondary: '#f43f5e',
      tertiary: '#0d9488',
      success: '#16a34a',
      info: '#2563eb',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#f8fafc',
      text: '#0f172a'
    }
  },
  teal: {
    id: 'teal',
    name: 'Soothing Teal',
    colors: {
      primary: '#0d9488',
      secondary: '#8b5cf6',
      tertiary: '#0ea5e9',
      success: '#16a34a',
      info: '#3b82f6',
      warning: '#d97706',
      danger: '#dc2626',
      background: '#f9fafb',
      text: '#111827'
    }
  },
  blue: {
    id: 'blue',
    name: 'Ocean Blue',
    colors: {
      primary: '#3b82f6',
      secondary: '#e11d48',
      tertiary: '#06b6d4',
      success: '#22c55e',
      info: '#0ea5e9',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f8fafc',
      text: '#0f172a'
    }
  },
  dark: {
    id: 'dark',
    name: 'Night Mode',
    colors: {
      primary: '#8b5cf6',
      secondary: '#ec4899',
      tertiary: '#06b6d4',
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#111827',
      text: '#f9fafb'
    }
  }
};

// Create a safe array of available themes
const safeThemePresetsArray = () => {
  try {
    return [
      themePresets.indigo,
      themePresets.purple,
      themePresets.teal,
      themePresets.blue,
      themePresets.dark
    ].filter(Boolean); // Remove any undefined entries
  } catch (error) {
    logThemeError('Error creating themes array', error);
    return [defaultPalette]; // Fallback to just the default
  }
};

// Create ThemeContext
const ThemeContext = createContext();

// Custom hook for using theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Log helper for debugging ThemeContext
const logThemeAction = (action, details = {}) => {
  console.log(`ThemeContext - ${action}:`, details);
};

// Safely parse JSON with fallback
const safeJsonParse = (jsonString, fallback) => {
  if (!jsonString) return fallback;
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Error parsing JSON in ThemeContext:', error);
    return fallback;
  }
};

// Safely access localStorage
const safeGetItem = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item === null ? fallback : item;
  } catch (error) {
    console.error(`Error accessing localStorage key "${key}":`, error);
    return fallback;
  }
};

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Log initialization
  logThemeAction('Initializing ThemeProvider');
  
  // Use safer initialization with proper error handling
  const [colorPalette, setColorPalette] = useState(() => {
    try {
      logThemeAction('Reading color palette from localStorage');
      const savedPalette = safeGetItem('hugmenow-color-palette', null);
      const parsedPalette = safeJsonParse(savedPalette, null);
      
      // Verify the parsed data has the expected structure
      if (parsedPalette && typeof parsedPalette === 'object' && parsedPalette.colors) {
        logThemeAction('Using stored color palette', { id: parsedPalette.id });
        return parsedPalette;
      } else {
        logThemeAction('Using default color palette', { id: defaultPalette.id });
        return defaultPalette;
      }
    } catch (error) {
      console.error('Failed to initialize color palette:', error);
      return defaultPalette;
    }
  });
  
  // Track if theme has changed for transition effects
  const [hasThemeChanged, setHasThemeChanged] = useState(false);
  
  // Track dark mode with safer initialization
  const [isDarkMode, setIsDarkMode] = useState(() => {
    try {
      logThemeAction('Reading dark mode preference');
      const savedDarkMode = safeGetItem('hugmenow-dark-mode', null);
      
      if (savedDarkMode !== null) {
        const parsedDarkMode = safeJsonParse(savedDarkMode, false);
        logThemeAction('Using stored dark mode preference', { isDarkMode: parsedDarkMode });
        return parsedDarkMode;
      }
      
      // Check if user prefers dark mode at OS level
      const prefersDarkMode = window.matchMedia && 
        window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      logThemeAction('Using system dark mode preference', { isDarkMode: prefersDarkMode });
      return prefersDarkMode;
    } catch (error) {
      console.error('Failed to initialize dark mode preference:', error);
      return false;
    }
  });

  // Track animation preference with safer initialization
  const [useAnimations, setUseAnimations] = useState(() => {
    try {
      logThemeAction('Reading animation preference');
      const savedAnimPref = safeGetItem('hugmenow-use-animations', null);
      
      if (savedAnimPref !== null) {
        const parsedAnimPref = safeJsonParse(savedAnimPref, true);
        logThemeAction('Using stored animation preference', { useAnimations: parsedAnimPref });
        return parsedAnimPref;
      }
      
      // Default to animations on
      logThemeAction('Using default animation preference', { useAnimations: true });
      return true;
    } catch (error) {
      console.error('Failed to initialize animation preference:', error);
      return true;
    }
  });
  
  // Color calculations utility functions
  const hexToRgb = useCallback((hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }, []);
  
  const rgbToHsl = useCallback((r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
      h = s = 0; // achromatic
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
        default: break;
      }
      
      h /= 6;
    }
    
    return [h * 360, s * 100, l * 100];
  }, []);
  
  const hslToRgb = useCallback((h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    
    return [
      Math.round(r * 255),
      Math.round(g * 255),
      Math.round(b * 255)
    ];
  }, []);
  
  // Apply CSS variables whenever colorPalette or dark mode changes
  useEffect(() => {
    try {
      const root = document.documentElement;
      
      // Set the data-theme attribute for CSS selectors
      root.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
      
      // Set animation preference
      root.setAttribute('data-animate', useAnimations ? 'true' : 'false');
      
      // Get effective palette (if dark mode is on and current palette isn't already dark)
      const effectivePalette = 
        isDarkMode && colorPalette.id !== 'dark' 
          ? themePresets.dark 
          : colorPalette;
      
      // Apply all colors from the palette to CSS variables
      Object.entries(effectivePalette.colors).forEach(([key, value]) => {
        root.style.setProperty(`--${key}-color`, value);
        
        // Create additional grays for better dark mode
        if (key === 'background' || key === 'text') {
          const rgb = hexToRgb(value);
          if (rgb) {
            const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            if (key === 'background') {
              // Create gray shades based on background color
              for (let i = 1; i <= 9; i++) {
                const step = i * 10;
                const newL = isDarkMode 
                  ? Math.min(95, l + step / 2) // In dark mode, make lighter grays
                  : Math.max(5, l - step / 2); // In light mode, make darker grays
                
                const [r, g, b] = hslToRgb(h, s, newL);
                root.style.setProperty(`--gray-${step}0`, `rgb(${r}, ${g}, ${b})`);
              }
            }
            
            // Set text variations based on main text color
            if (key === 'text') {
              const [r, g, b] = rgb;
              root.style.setProperty(`--text-primary`, value);
              root.style.setProperty(`--text-secondary`, `rgba(${r}, ${g}, ${b}, 0.75)`);
              root.style.setProperty(`--text-tertiary`, `rgba(${r}, ${g}, ${b}, 0.5)`);
              root.style.setProperty(`--text-placeholder`, `rgba(${r}, ${g}, ${b}, 0.3)`);
            }
          }
        }
        
        // Enhanced color variant creation for our design system
        if (['primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'danger'].includes(key)) {
          const rgb = hexToRgb(value);
          if (rgb) {
            // Convert to HSL for better color manipulation
            const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
            
            // Create variants based on lightness adjustments
            const createColorVariant = (lightAdjust) => {
              const newL = Math.max(0, Math.min(100, l + lightAdjust));
              const [r, g, b] = hslToRgb(h, s, newL);
              return `rgb(${r}, ${g}, ${b})`;
            };
            
            // Create multiple variants for enhanced color system
            root.style.setProperty(`--${key}-lightest`, createColorVariant(30));
            root.style.setProperty(`--${key}-light`, createColorVariant(10));
            root.style.setProperty(`--${key}-dark`, createColorVariant(-10));
            root.style.setProperty(`--${key}-darkest`, createColorVariant(-20));
            
            // Add semi-transparent variants for overlays and subtle UI elements
            root.style.setProperty(`--${key}-alpha-10`, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.1)`);
            root.style.setProperty(`--${key}-alpha-20`, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`);
            root.style.setProperty(`--${key}-alpha-50`, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.5)`);
          }
        }
      });
      
      // Set other theme related variables
      root.style.setProperty('--input-bg', isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)');
      root.style.setProperty('--input-border', isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
      root.style.setProperty('--input-border-hover', isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)');
      root.style.setProperty('--glassmorph-bg', isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)');
      root.style.setProperty('--glassmorph-border', isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.18)');
      
      // Save state to localStorage
      localStorage.setItem('hugmenow-color-palette', JSON.stringify(colorPalette));
      localStorage.setItem('hugmenow-dark-mode', JSON.stringify(isDarkMode));
      localStorage.setItem('hugmenow-use-animations', JSON.stringify(useAnimations));
      
      // Mark that theme has changed for animations
      if (!hasThemeChanged) {
        setHasThemeChanged(true);
      }
    } catch (error) {
      console.error('Error applying theme CSS variables:', error);
    }
  }, [colorPalette, isDarkMode, useAnimations, hexToRgb, rgbToHsl, hslToRgb, hasThemeChanged]);
  
  // Function to update the color palette
  const setTheme = (newPaletteId) => {
    try {
      const newPalette = themePresets[newPaletteId] || defaultPalette;
      setColorPalette(newPalette);
    } catch (error) {
      console.error('Error setting theme:', error);
      // If there's an error, set to default palette as a fallback
      setColorPalette(defaultPalette);
    }
  };
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Toggle animations
  const toggleAnimations = () => {
    setUseAnimations(prev => !prev);
  };
  
  // Get available themes safely
  const getAvailableThemes = () => {
    try {
      // First check if we already have a themes array function
      if (typeof safeThemePresetsArray === 'function') {
        return safeThemePresetsArray();
      }
      
      // Fallback to trying direct access
      const themes = [
        themePresets.indigo,
        themePresets.purple,
        themePresets.teal,
        themePresets.blue,
        themePresets.dark
      ].filter(Boolean);
      
      if (themes.length > 0) {
        return themes;
      }
      
      // Final fallback
      return [defaultPalette];
    } catch (error) {
      console.error('Error getting available themes:', error);
      return [defaultPalette];
    }
  };
  
  // Value to be provided by context
  const contextValue = {
    colorPalette,
    setTheme,
    isDarkMode,
    toggleDarkMode,
    useAnimations,
    toggleAnimations,
    hasThemeChanged,
    // Use our safe getter function to avoid 'is not iterable' errors
    availableThemes: getAvailableThemes()
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;