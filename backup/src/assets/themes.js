/**
 * App themes definitions
 */
export const themes = {
  // Default purple theme
  default: {
    name: 'Purple Comfort',
    colors: {
      primary: '#7c4dff',
      secondary: '#ff4d8c',
      accent: '#43d6b5',
      background: '#ffffff',
      text: '#333333',
      textLight: '#666666',
      border: '#dddddd',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336'
    },
    darkMode: false,
    description: 'Default theme with calming purple tones'
  },
  
  // Dark mode theme
  dark: {
    name: 'Night Mode',
    colors: {
      primary: '#4A148C',
      secondary: '#E91E63',
      accent: '#00BCD4',
      background: '#121212',
      text: '#EEEEEE',
      textLight: '#AAAAAA',
      border: '#333333',
      success: '#4CAF50',
      warning: '#FFC107',
      error: '#F44336'
    },
    darkMode: true,
    description: 'Dark theme that's easy on the eyes'
  },
  
  // Soft pastel theme
  pastel: {
    name: 'Soft Pastel',
    colors: {
      primary: '#FFAFCC',
      secondary: '#A2D2FF',
      accent: '#FFC8DD',
      background: '#FDFDFD',
      text: '#5E5E5E',
      textLight: '#8E8E8E',
      border: '#EFEFEF',
      success: '#BDE0FE',
      warning: '#FDFFB6',
      error: '#FFAFCC'
    },
    darkMode: false,
    description: 'Gentle pastel colors for a soothing experience'
  },
  
  // Vibrant playful theme
  vibrant: {
    name: 'Playful Vibrance',
    colors: {
      primary: '#FF5722',
      secondary: '#4CAF50',
      accent: '#2196F3',
      background: '#FFFFFF',
      text: '#212121',
      textLight: '#757575',
      border: '#E0E0E0',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336'
    },
    darkMode: false,
    description: 'Bright and energetic colors that pop'
  },
  
  // Ocean theme
  ocean: {
    name: 'Ocean Calm',
    colors: {
      primary: '#006064',
      secondary: '#00ACC1',
      accent: '#84FFFF',
      background: '#E0F7FA',
      text: '#263238',
      textLight: '#455A64',
      border: '#B2EBF2',
      success: '#26A69A',
      warning: '#FFCA28',
      error: '#EF5350'
    },
    darkMode: false,
    description: 'Soothing blue tones inspired by the ocean'
  },
  
  // Nature theme
  nature: {
    name: 'Natural Harmony',
    colors: {
      primary: '#388E3C',
      secondary: '#8BC34A',
      accent: '#FFEB3B',
      background: '#F1F8E9',
      text: '#33691E',
      textLight: '#558B2F',
      border: '#DCEDC8',
      success: '#689F38',
      warning: '#FBC02D',
      error: '#E57373'
    },
    darkMode: false,
    description: 'Earthy green tones inspired by nature'
  },
  
  // Sunset theme
  sunset: {
    name: 'Warm Sunset',
    colors: {
      primary: '#FF9800',
      secondary: '#F44336',
      accent: '#FFEB3B',
      background: '#FFF3E0',
      text: '#3E2723',
      textLight: '#5D4037',
      border: '#FFCCBC',
      success: '#8D6E63',
      warning: '#FB8C00',
      error: '#D84315'
    },
    darkMode: false,
    description: 'Warm colors inspired by beautiful sunsets'
  },
  
  // Minimal monochrome theme
  minimal: {
    name: 'Minimal Mono',
    colors: {
      primary: '#212121',
      secondary: '#757575',
      accent: '#9E9E9E',
      background: '#FAFAFA',
      text: '#212121',
      textLight: '#757575',
      border: '#EEEEEE',
      success: '#616161',
      warning: '#9E9E9E',
      error: '#424242'
    },
    darkMode: false,
    description: 'Clean monochrome design for minimalists'
  }
};

export default themes;
