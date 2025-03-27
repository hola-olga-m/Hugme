import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

// Explicitly define and log an error handling function
function logThemeError(message, details) {
  console.error(`ThemeContext ERROR: ${message}`, details);
}

// Safely define our default palette to ensure it exists
const defaultPalette = {
  id: 'serenity',
  name: 'Serenity Blue',
  colors: {
    primary: '#5e72e4', // Serene blue-purple for trust and comfort
    secondary: '#ff7eb3', // Warm pink for emotional warmth and connection
    tertiary: '#36d6b7', // Energetic teal for wellness and calm
    success: '#22c55e', // Enhanced green from our CSS vars
    info: '#3b82f6', // Enhanced blue from our CSS vars
    warning: '#f59e0b', // Enhanced amber from our CSS vars
    danger: '#ef4444', // Enhanced red from our CSS vars
    background: '#f9fafb', // Light gray background
    text: '#111827', // Dark text
    accent: '#a78bfa', // Soft purple accent
    neutral: '#64748b', // Balanced neutral tone
    muted: '#94a3b8' // Subdued text/UI elements
  }
};

// Create the theme presets as a simple object
const themePresets = {
  serenity: {
    id: 'serenity',
    name: 'Serenity Blue',
    colors: {
      primary: '#5e72e4', // Serene blue-purple for trust and comfort
      secondary: '#ff7eb3', // Warm pink for emotional warmth and connection
      tertiary: '#36d6b7', // Energetic teal for wellness and calm
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f9fafb',
      text: '#111827',
      accent: '#a78bfa',
      neutral: '#64748b',
      muted: '#94a3b8'
    }
  },
  lavender: {
    id: 'lavender',
    name: 'Lavender Comfort',
    colors: {
      primary: '#7c3aed',
      secondary: '#ff9f8e',
      tertiary: '#4bc2c5',
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f8fafc',
      text: '#0f172a',
      accent: '#c084fc',
      neutral: '#64748b',
      muted: '#94a3b8'
    }
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean Calm',
    colors: {
      primary: '#0ea5e9',
      secondary: '#e879f9',
      tertiary: '#34d399',
      success: '#22c55e',
      info: '#5ea3fb',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f9fafb',
      text: '#111827',
      accent: '#93c5fd',
      neutral: '#64748b',
      muted: '#94a3b8'
    }
  },
  sunset: {
    id: 'sunset',
    name: 'Sunset Warmth',
    colors: {
      primary: '#f97316',
      secondary: '#c084fc',
      tertiary: '#06b6d4',
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f8fafc',
      text: '#0f172a',
      accent: '#fda4af',
      neutral: '#64748b',
      muted: '#94a3b8'
    }
  },
  dark: {
    id: 'dark',
    name: 'Midnight Comfort',
    colors: {
      primary: '#7f97ff',
      secondary: '#ff7eb3',
      tertiary: '#5eecd1',
      success: '#4ade80',
      info: '#60a5fa',
      warning: '#fbbf24',
      danger: '#f87171',
      background: '#111827',
      text: '#f9fafb',
      accent: '#c084fc',
      neutral: '#94a3b8',
      muted: '#64748b'
    }
  },
  harmony: {
    id: 'harmony',
    name: 'Emotional Harmony',
    colors: {
      primary: '#6366f1', // Indigo
      secondary: '#f472b6', // Pink
      tertiary: '#10b981', // Emerald
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f9fafb',
      text: '#111827',
      accent: '#a78bfa',
      neutral: '#64748b',
      muted: '#94a3b8'
    }
  },
  tranquil: {
    id: 'tranquil',
    name: 'Tranquil Mind',
    colors: {
      primary: '#14b8a6', // Teal
      secondary: '#f43f5e', // Rose
      tertiary: '#8b5cf6', // Violet
      success: '#22c55e',
      info: '#3b82f6',
      warning: '#f59e0b',
      danger: '#ef4444',
      background: '#f8fafc',
      text: '#0f172a',
      accent: '#38bdf8',
      neutral: '#64748b',
      muted: '#94a3b8'
    }
  }
};

// Create a safe array of available themes
const safeThemePresetsArray = () => {
  try {
    return [
      themePresets.serenity,
      themePresets.lavender,
      themePresets.ocean,
      themePresets.sunset,
      themePresets.harmony,
      themePresets.tranquil, 
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
    if (!hex || typeof hex !== 'string') {
      console.warn(`Invalid hex color value: ${hex}`);
      return null;
    }
    
    // Handle 3-character hex values like #FFF
    if (hex.length === 4) {
      const r = hex.charAt(1);
      const g = hex.charAt(2);
      const b = hex.charAt(3);
      hex = `#${r}${r}${g}${g}${b}${b}`;
    }
    
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
      console.warn(`Could not parse hex color: ${hex}`);
      return null;
    }
    
    return {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    };
  }, []);
  
  const rgbToHsl = useCallback((r, g, b) => {
    try {
      if (r === undefined || g === undefined || b === undefined) {
        console.warn(`Invalid RGB values for conversion: r=${r}, g=${g}, b=${b}`);
        return [0, 0, 50]; // Default to gray
      }
      
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
          default: h = 0; break;
        }
        
        h /= 6;
      }
      
      return [h * 360, s * 100, l * 100];
    } catch (error) {
      console.error(`Error converting RGB to HSL: r=${r}, g=${g}, b=${b}`, error);
      return [0, 0, 50]; // Default to gray
    }
  }, []);
  
  const hslToRgb = useCallback((h, s, l) => {
    try {
      if (h === undefined || s === undefined || l === undefined) {
        console.warn(`Invalid HSL values for conversion: h=${h}, s=${s}, l=${l}`);
        return [128, 128, 128]; // Default to gray
      }
      
      h = Number(h) / 360;
      s = Number(s) / 100;
      l = Number(l) / 100;
      
      // Ensure values are in valid ranges
      h = Math.max(0, Math.min(1, h));
      s = Math.max(0, Math.min(1, s));
      l = Math.max(0, Math.min(1, l));
      
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
    } catch (error) {
      console.error(`Error converting HSL to RGB: h=${h}, s=${s}, l=${l}`, error);
      return [128, 128, 128]; // Default to gray
    }
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
      Object.entries(effectivePalette.colors || {}).forEach(([key, value]) => {
        try {
          // Only process if key and value are valid
          if (!key || !value) {
            console.warn(`Invalid color key or value: ${key}=${value}`);
            return;
          }
          
          // Set the base color CSS variable
          root.style.setProperty(`--${key}-color`, value);
          
          // Create additional grays for better dark mode
          if (key === 'background' || key === 'text') {
            const rgb = hexToRgb(value);
            if (rgb) {
              const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
              
              if (key === 'background') {
                try {
                  // Create gray shades based on background color
                  for (let i = 1; i <= 9; i++) {
                    const step = i * 10;
                    const newL = isDarkMode 
                      ? Math.min(95, l + step / 2) // In dark mode, make lighter grays
                      : Math.max(5, l - step / 2); // In light mode, make darker grays
                    
                    const [r, g, b] = hslToRgb(h, s, newL);
                    
                    // Ensure we have valid RGB values before setting the CSS variable
                    if (r !== undefined && g !== undefined && b !== undefined) {
                      root.style.setProperty(`--gray-${step}0`, `rgb(${r}, ${g}, ${b})`);
                    } else {
                      // Fallback to a calculated gray if HSL conversion fails
                      const grayValue = isDarkMode 
                        ? Math.min(255, 20 + i * 25) 
                        : Math.max(0, 235 - i * 25);
                      root.style.setProperty(`--gray-${step}0`, `rgb(${grayValue}, ${grayValue}, ${grayValue})`);
                    }
                  }
                } catch (gradientError) {
                  console.warn(`Error creating gray gradient for background: ${gradientError}`);
                  // Create a fallback gray scale if gradient creation fails
                  for (let i = 1; i <= 9; i++) {
                    const step = i * 10;
                    const grayValue = isDarkMode 
                      ? Math.min(255, 20 + i * 25) 
                      : Math.max(0, 235 - i * 25);
                    root.style.setProperty(`--gray-${step}0`, `rgb(${grayValue}, ${grayValue}, ${grayValue})`);
                  }
                }
              }
              
              // Set text variations based on main text color
              if (key === 'text') {
                // Safely access RGB values with fallbacks
                if (rgb && typeof rgb === 'object') {
                  // Destructure with fallback values if a property is undefined
                  const r = rgb.r ?? 0;
                  const g = rgb.g ?? 0;
                  const b = rgb.b ?? 0;
                  
                  root.style.setProperty(`--text-primary`, value);
                  root.style.setProperty(`--text-secondary`, `rgba(${r}, ${g}, ${b}, 0.75)`);
                  root.style.setProperty(`--text-tertiary`, `rgba(${r}, ${g}, ${b}, 0.5)`);
                  root.style.setProperty(`--text-placeholder`, `rgba(${r}, ${g}, ${b}, 0.3)`);
                } else {
                  // Fallback to using the hex value for all text variations
                  root.style.setProperty(`--text-primary`, value);
                  root.style.setProperty(`--text-secondary`, value);
                  root.style.setProperty(`--text-tertiary`, value);
                  root.style.setProperty(`--text-placeholder`, value);
                  console.warn(`Could not create text color variations for ${value}, using solid colors`);
                }
              }
            }
          }
          
          // Enhanced color variant creation for our design system
          if (['primary', 'secondary', 'tertiary', 'success', 'info', 'warning', 'danger', 'accent', 'neutral', 'muted'].includes(key)) {
            const rgb = hexToRgb(value);
            if (rgb) {
              // Convert to HSL for better color manipulation
              const [h, s, l] = rgbToHsl(rgb.r, rgb.g, rgb.b);
              
              // Create variants based on lightness adjustments with error handling
              const createColorVariant = (lightAdjust) => {
                try {
                  const newL = Math.max(0, Math.min(100, l + lightAdjust));
                  const [r, g, b] = hslToRgb(h, s, newL);
                  
                  // Check if we have valid RGB values
                  if (r !== undefined && g !== undefined && b !== undefined) {
                    return `rgb(${r}, ${g}, ${b})`;
                  } else {
                    // If HSL conversion fails, create a variant based on the original RGB values
                    const adjust = lightAdjust > 0 ? 
                      Math.min(255 - rgb.r, 255 - rgb.g, 255 - rgb.b, lightAdjust * 2.55) : 
                      Math.max(-rgb.r, -rgb.g, -rgb.b, lightAdjust * 2.55);
                    
                    return `rgb(
                      ${Math.max(0, Math.min(255, Math.round(rgb.r + adjust)))}, 
                      ${Math.max(0, Math.min(255, Math.round(rgb.g + adjust)))}, 
                      ${Math.max(0, Math.min(255, Math.round(rgb.b + adjust)))}
                    )`;
                  }
                } catch (error) {
                  console.warn(`Error creating color variant with adjustment ${lightAdjust}:`, error);
                  // Return the original color as fallback
                  return value;
                }
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
        } catch (variableError) {
          console.error(`Error processing color variable for key "${key}":`, variableError);
        }
      });
      
      // Set other theme related variables
      root.style.setProperty('--input-bg', isDarkMode ? 'rgba(255,255,255,0.07)' : 'rgba(255,255,255,0.9)');
      root.style.setProperty('--input-border', isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)');
      root.style.setProperty('--input-border-hover', isDarkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)');
      
      // Glassmorphism design system variables
      root.style.setProperty('--glassmorph-bg', isDarkMode ? 'rgba(0,0,0,0.65)' : 'rgba(255,255,255,0.7)');
      root.style.setProperty('--glassmorph-border', isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.18)');
      root.style.setProperty('--glassmorph-shadow', isDarkMode ? '0 8px 32px rgba(0, 0, 0, 0.4)' : '0 8px 32px rgba(0, 0, 0, 0.07)');
      root.style.setProperty('--glassmorph-blur', '10px');
      
      // Card and container related variables
      root.style.setProperty('--card-bg', isDarkMode ? 'rgba(17, 24, 39, 0.8)' : 'rgba(255, 255, 255, 0.9)');
      root.style.setProperty('--card-border', isDarkMode ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid rgba(0, 0, 0, 0.06)');
      root.style.setProperty('--card-shadow', isDarkMode ? '0 4px 12px rgba(0, 0, 0, 0.5)' : '0 4px 12px rgba(0, 0, 0, 0.05)');
      
      // Interaction state variables
      root.style.setProperty('--hover-overlay', isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)');
      root.style.setProperty('--active-overlay', isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)');
      
      // Safe access to primary color
      try {
        if (effectivePalette.colors && effectivePalette.colors.primary) {
          root.style.setProperty('--focus-ring', effectivePalette.colors.primary + (isDarkMode ? '40' : '66'));
        } else {
          // Fallback to a default focus ring color
          root.style.setProperty('--focus-ring', isDarkMode ? '#7f97ff40' : '#5e72e466');
        }
      } catch (e) {
        console.error('Error setting focus ring variable:', e);
        root.style.setProperty('--focus-ring', isDarkMode ? 'rgba(127, 151, 255, 0.25)' : 'rgba(94, 114, 228, 0.4)');
      }
      
      // Save state to localStorage
      localStorage.setItem('hugmenow-color-palette', JSON.stringify(colorPalette));
      localStorage.setItem('hugmenow-dark-mode', JSON.stringify(isDarkMode));
      localStorage.setItem('hugmenow-use-animations', JSON.stringify(useAnimations));
      
      // Mark that theme has changed for animations
      if (!hasThemeChanged) {
        setHasThemeChanged(true);
      }
    } catch (error) {
      // More detailed error logging
      console.error('Error applying theme CSS variables:', error);
      console.error('Current effectivePalette:', isDarkMode && colorPalette.id !== 'dark' 
        ? themePresets.dark 
        : colorPalette);
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
        themePresets.serenity,
        themePresets.lavender,
        themePresets.ocean,
        themePresets.sunset,
        themePresets.harmony,
        themePresets.tranquil,
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