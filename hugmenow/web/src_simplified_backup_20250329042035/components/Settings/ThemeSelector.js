import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../contexts/ThemeContext';
import { UserContext } from '../../contexts/UserContext';
import { themes } from '../../assets/themes';
import { playHapticFeedback } from '../../utils/haptics';

const ThemeSelector = () => {
  const [selectedTheme, setSelectedTheme] = useState(null);
  const [customColors, setCustomColors] = useState({
    primary: '#7c4dff',
    secondary: '#ff4d8c',
    accent: '#4dc5ff',
    background: '#ffffff'
  });
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [previewTheme, setPreviewTheme] = useState(null);
  
  const { theme, setTheme, saveUserThemePreference } = useContext(ThemeContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Set initial selected theme based on current theme
    setSelectedTheme(theme);
    setPreviewTheme(theme);
  }, [theme]);
  
  const handleThemeSelect = (themeId) => {
    setSelectedTheme(themeId);
    setPreviewTheme(themeId);
    playHapticFeedback('selection');
  };
  
  const handleCustomColorChange = (colorName, value) => {
    setCustomColors(prev => ({
      ...prev,
      [colorName]: value
    }));
    
    // Update preview with custom colors
    document.documentElement.style.setProperty(`--custom-${colorName}`, value);
    
    if (selectedTheme !== 'custom') {
      setSelectedTheme('custom');
    }
    
    setPreviewTheme('custom');
  };
  
  const handleApplyTheme = async () => {
    if (selectedTheme === 'custom') {
      // Save custom colors to localStorage or backend
      localStorage.setItem('customThemeColors', JSON.stringify(customColors));
    }
    
    setTheme(selectedTheme);
    
    // Save user preference
    if (user) {
      await saveUserThemePreference(user.id, selectedTheme);
    }
    
    playHapticFeedback('success');
    navigate('/profile');
  };
  
  const toggleCustomizer = () => {
    setIsCustomizing(!isCustomizing);
    
    if (!isCustomizing) {
      // Load saved custom colors if available
      const savedCustomColors = localStorage.getItem('customThemeColors');
      if (savedCustomColors) {
        const parsedColors = JSON.parse(savedCustomColors);
        setCustomColors(parsedColors);
        
        // Apply custom colors to preview
        Object.entries(parsedColors).forEach(([colorName, value]) => {
          document.documentElement.style.setProperty(`--custom-${colorName}`, value);
        });
      }
    }
    
    playHapticFeedback('selection');
  };
  
  return (
    <div className={`theme-selector-container theme-${previewTheme}`}>
      <header className="page-header">
        <button className="back-button" onClick={() => navigate('/profile')}>
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1>Choose Theme</h1>
        <button 
          className="customize-button"
          onClick={toggleCustomizer}
        >
          <i className={`fas fa-${isCustomizing ? 'palette' : 'sliders-h'}`}></i>
        </button>
      </header>
      
      {isCustomizing ? (
        <div className="theme-customizer">
          <h2>Customize Your Theme</h2>
          
          <div className="color-pickers">
            <div className="color-picker">
              <label htmlFor="primaryColor">Primary Color</label>
              <input
                type="color"
                id="primaryColor"
                value={customColors.primary}
                onChange={(e) => handleCustomColorChange('primary', e.target.value)}
              />
            </div>
            
            <div className="color-picker">
              <label htmlFor="secondaryColor">Secondary Color</label>
              <input
                type="color"
                id="secondaryColor"
                value={customColors.secondary}
                onChange={(e) => handleCustomColorChange('secondary', e.target.value)}
              />
            </div>
            
            <div className="color-picker">
              <label htmlFor="accentColor">Accent Color</label>
              <input
                type="color"
                id="accentColor"
                value={customColors.accent}
                onChange={(e) => handleCustomColorChange('accent', e.target.value)}
              />
            </div>
            
            <div className="color-picker">
              <label htmlFor="backgroundColor">Background Color</label>
              <input
                type="color"
                id="backgroundColor"
                value={customColors.background}
                onChange={(e) => handleCustomColorChange('background', e.target.value)}
              />
            </div>
          </div>
          
          <div className="custom-theme-preview">
            <h3>Preview</h3>
            <div className="preview-elements">
              <div className="preview-button primary">Primary Button</div>
              <div className="preview-button secondary">Secondary Button</div>
              <div className="preview-card">
                <div className="preview-card-header">Card Header</div>
                <div className="preview-card-body">
                  <p>This is how your custom theme will look</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="themes-grid">
          {Object.entries(themes).map(([themeId, themeData]) => (
            <div 
              key={themeId}
              className={`theme-card ${selectedTheme === themeId ? 'selected' : ''}`}
              onClick={() => handleThemeSelect(themeId)}
            >
              <div 
                className="theme-preview" 
                style={{ 
                  background: `linear-gradient(135deg, ${themeData.colors.primary} 0%, ${themeData.colors.secondary} 100%)` 
                }}
              >
                <div className="theme-preview-elements">
                  <div className="preview-dot accent" style={{ background: themeData.colors.accent }}></div>
                  <div className="preview-bar"></div>
                  <div className="preview-button"></div>
                </div>
              </div>
              <div className="theme-name">{themeData.name}</div>
              {selectedTheme === themeId && (
                <div className="theme-selected-indicator">
                  <i className="fas fa-check-circle"></i>
                </div>
              )}
            </div>
          ))}
          
          <div 
            className={`theme-card custom ${selectedTheme === 'custom' ? 'selected' : ''}`}
            onClick={() => toggleCustomizer()}
          >
            <div className="theme-preview custom-preview">
              <div className="color-palette">
                <div className="color-dot" style={{ background: customColors.primary }}></div>
                <div className="color-dot" style={{ background: customColors.secondary }}></div>
                <div className="color-dot" style={{ background: customColors.accent }}></div>
              </div>
              <div className="custom-text">
                <i className="fas fa-palette"></i>
                <span>Custom</span>
              </div>
            </div>
            <div className="theme-name">Custom Theme</div>
            {selectedTheme === 'custom' && (
              <div className="theme-selected-indicator">
                <i className="fas fa-check-circle"></i>
              </div>
            )}
          </div>
        </div>
      )}
      
      <button 
        className="apply-theme-button"
        onClick={handleApplyTheme}
        disabled={!selectedTheme || selectedTheme === theme}
      >
        Apply Theme
      </button>
      
      <div className="theme-information">
        <h3>Theme Features</h3>
        <ul className="theme-features">
          <li><i className="fas fa-paint-brush"></i> Change app appearance</li>
          <li><i className="fas fa-moon"></i> Dark and light options</li>
          <li><i className="fas fa-palette"></i> Custom color scheme</li>
          <li><i className="fas fa-sync"></i> Sync across your devices</li>
        </ul>
      </div>
    </div>
  );
};

export default ThemeSelector;
