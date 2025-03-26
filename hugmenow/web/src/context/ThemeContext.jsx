import React, { createContext, useContext, useState, useEffect } from 'react';

// Default color palette
const defaultPalette = {
  id: 'ocean',
  name: 'Ocean Calm',
  colors: {
    primary: '#4A90E2',
    secondary: '#50E3C2',
    tertiary: '#F8E71C',
    success: '#7ED321',
    info: '#B8E986',
    warning: '#F5A623',
    danger: '#D0021B',
    background: '#F5F8FA',
    text: '#4A4A4A'
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

// ThemeProvider component
export const ThemeProvider = ({ children }) => {
  // Initialize theme state from localStorage or use default
  const [colorPalette, setColorPalette] = useState(() => {
    const savedPalette = localStorage.getItem('hugmenow-color-palette');
    return savedPalette ? JSON.parse(savedPalette) : defaultPalette;
  });
  
  // Track if theme has changed for transition effects
  const [hasThemeChanged, setHasThemeChanged] = useState(false);
  
  // Apply CSS variables whenever colorPalette changes
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply all colors from the palette to CSS variables
    Object.entries(colorPalette.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}-color`, value);
      
      // For primary, secondary, and tertiary, create lighter and darker variants
      if (['primary', 'secondary', 'tertiary'].includes(key)) {
        // Convert hex to RGB for opacity variants
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
          return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
          } : null;
        };
        
        const rgb = hexToRgb(value);
        if (rgb) {
          // Create lighter variant (with opacity)
          root.style.setProperty(`--${key}-light`, `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.3)`);
          
          // Create darker variant (darken by 15%)
          const darken = (color, percent) => {
            const factor = 1 - percent / 100;
            return {
              r: Math.round(color.r * factor),
              g: Math.round(color.g * factor),
              b: Math.round(color.b * factor)
            };
          };
          
          const darkRgb = darken(rgb, 15);
          root.style.setProperty(
            `--${key}-dark`, 
            `rgb(${darkRgb.r}, ${darkRgb.g}, ${darkRgb.b})`
          );
        }
      }
    });
    
    // Save to localStorage
    localStorage.setItem('hugmenow-color-palette', JSON.stringify(colorPalette));
    
    // Mark that theme has changed for animations
    if (!hasThemeChanged) {
      setHasThemeChanged(true);
    }
  }, [colorPalette]);
  
  // Function to update the color palette
  const setTheme = (newPalette) => {
    setColorPalette(newPalette);
  };
  
  // Value to be provided by context
  const contextValue = {
    colorPalette,
    setTheme,
    hasThemeChanged
  };
  
  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;