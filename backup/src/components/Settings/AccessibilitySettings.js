
import React, { useState, useContext, useEffect } from 'react';
import { ThemeContext } from '../../contexts/ThemeContext';
import '../../styles/Settings.css';

const AccessibilitySettings = () => {
  const { theme } = useContext(ThemeContext);
  const [settings, setSettings] = useState({
    textSize: 'medium',
    contrastMode: false,
    reducedMotion: false,
    screenReaderOptimized: false,
    hapticFeedback: 'medium'
  });
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);
  
  // Load saved settings from localStorage on component mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('accessibilitySettings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
      
      // Apply settings to document
      applyAccessibilitySettings(JSON.parse(savedSettings));
    }
  }, []);
  
  // Function to apply accessibility settings to the document
  const applyAccessibilitySettings = (settingsObj) => {
    // Apply text size
    document.documentElement.setAttribute('data-text-size', settingsObj.textSize);
    
    // Apply contrast mode
    if (settingsObj.contrastMode) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (settingsObj.reducedMotion) {
      document.documentElement.classList.add('reduced-motion');
    } else {
      document.documentElement.classList.remove('reduced-motion');
    }
    
    // Apply screen reader optimizations
    if (settingsObj.screenReaderOptimized) {
      document.documentElement.classList.add('screen-reader-optimized');
    } else {
      document.documentElement.classList.remove('screen-reader-optimized');
    }
  };
  
  // Handle settings change
  const handleSettingChange = (setting, value) => {
    const newSettings = { ...settings, [setting]: value };
    setSettings(newSettings);
    
    // Apply settings immediately
    applyAccessibilitySettings(newSettings);
  };
  
  // Save settings
  const saveSettings = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
      setIsSaving(false);
      setSaveMessage('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSaveMessage(null);
      }, 3000);
    }, 500);
  };
  
  return (
    <div className={`settings-container accessibility-settings theme-${theme}`}>
      <div className="settings-header">
        <h2>Accessibility Settings</h2>
        <p>Customize your experience to make HugMood more accessible for your needs.</p>
      </div>
      
      <div className="settings-section">
        <h3>Visual Settings</h3>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="textSize">Text Size</label>
            <p className="setting-description">Adjust the size of text throughout the app</p>
          </div>
          <div className="setting-control">
            <select 
              id="textSize"
              value={settings.textSize}
              onChange={(e) => handleSettingChange('textSize', e.target.value)}
              className="text-size-select"
            >
              <option value="small">Small</option>
              <option value="medium">Medium (Default)</option>
              <option value="large">Large</option>
              <option value="x-large">Extra Large</option>
            </select>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="contrastMode">High Contrast Mode</label>
            <p className="setting-description">Enhance visual contrast for better readability</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="contrastMode"
                checked={settings.contrastMode}
                onChange={(e) => handleSettingChange('contrastMode', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="reducedMotion">Reduced Motion</label>
            <p className="setting-description">Minimize animations for motion sensitivity</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="reducedMotion"
                checked={settings.reducedMotion}
                onChange={(e) => handleSettingChange('reducedMotion', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Assistive Technology</h3>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="screenReaderOptimized">Screen Reader Support</label>
            <p className="setting-description">Optimize the app for screen readers</p>
          </div>
          <div className="setting-control">
            <label className="toggle-switch">
              <input
                type="checkbox"
                id="screenReaderOptimized"
                checked={settings.screenReaderOptimized}
                onChange={(e) => handleSettingChange('screenReaderOptimized', e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>
        
        <div className="setting-item">
          <div className="setting-label">
            <label htmlFor="hapticFeedback">Haptic Feedback</label>
            <p className="setting-description">Adjust vibration feedback intensity</p>
          </div>
          <div className="setting-control">
            <select 
              id="hapticFeedback"
              value={settings.hapticFeedback}
              onChange={(e) => handleSettingChange('hapticFeedback', e.target.value)}
              className="haptic-select"
            >
              <option value="off">Off</option>
              <option value="light">Light</option>
              <option value="medium">Medium</option>
              <option value="strong">Strong</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="settings-section">
        <h3>Preview</h3>
        <div className="preview-area">
          <div className="preview-card">
            <h4>Text Size Sample</h4>
            <p>This is how text will appear throughout the app.</p>
            <div className="preview-actions">
              <button className="preview-button">Button Example</button>
              <a href="#" className="preview-link">Link Example</a>
            </div>
          </div>
        </div>
      </div>
      
      <div className="settings-actions">
        <button 
          className="save-settings-btn"
          onClick={saveSettings}
          disabled={isSaving}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
        
        {saveMessage && (
          <div className="settings-save-message">
            <i className="fas fa-check-circle"></i>
            <span>{saveMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AccessibilitySettings;
