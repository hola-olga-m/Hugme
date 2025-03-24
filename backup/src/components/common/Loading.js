import React from 'react';

/**
 * Loading component for showing various loading indicators
 * @param {Object} props - Component props
 * @param {boolean} props.fullScreen - Whether to display as fullscreen overlay
 * @param {string} props.type - Loading animation type (pulse, spinner, dots)
 * @param {string} props.size - Size of the loader (small, medium, large)
 * @param {string} props.text - Optional text to display with the loader
 * @param {string} props.color - Color of the loader
 */
const Loading = ({ 
  fullScreen = false, 
  type = 'pulse', 
  size = 'medium',
  text = 'Loading...', 
  color = ''
}) => {
  const getLoaderClasses = () => {
    const classes = ['loader', `loader-${type}`, `size-${size}`];
    if (color) classes.push(`color-${color}`);
    return classes.join(' ');
  };

  const containerClasses = [
    'loading-container', 
    fullScreen ? 'fullscreen' : ''
  ].filter(Boolean).join(' ');

  // Render different loader types
  const renderLoader = () => {
    switch (type) {
      case 'spinner':
        return (
          <div className={getLoaderClasses()}>
            <div className="spinner"></div>
          </div>
        );
      
      case 'dots':
        return (
          <div className={getLoaderClasses()}>
            <div className="dot dot1"></div>
            <div className="dot dot2"></div>
            <div className="dot dot3"></div>
          </div>
        );
      
      case 'pulse':
      default:
        return (
          <div className={getLoaderClasses()}>
            <div className="heart-pulse"></div>
          </div>
        );
    }
  };

  return (
    <div className={containerClasses}>
      <div className="loading-content">
        {renderLoader()}
        {text && <p className="loading-text">{text}</p>}
      </div>
    </div>
  );
};

export default Loading;