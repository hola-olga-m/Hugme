import React from 'react';

// Map of hug types to descriptive text (used for alt text and fallbacks)
const HUG_DESCRIPTIONS = {
  QUICK: 'A brief, friendly embrace',
  WARM: 'A tender, heartfelt hug',
  SUPPORTIVE: 'A strong, reassuring embrace',
  COMFORTING: 'A gentle, soothing hug',
  ENCOURAGING: 'An energizing, motivational embrace',
  CELEBRATORY: 'A joyful, exciting hug'
};

// Map of hug types to colors
const HUG_COLORS = {
  QUICK: '#4A90E2',
  WARM: '#FF6B6B',
  SUPPORTIVE: '#4285F4',
  COMFORTING: '#9D65C9',
  ENCOURAGING: '#FFC857',
  CELEBRATORY: '#4ADE80'
};

/**
 * Component to display cute hug illustration based on type
 */
export const HugEmoji = ({ type, className = '', size = 24 }) => {
  const emojiSize = size || 24;
  const color = HUG_COLORS[type] || '#4A90E2';
  
  const getHugIllustration = () => {
    switch (type) {
      case 'QUICK':
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 12C10 12 11 7 8.5 7C6 7 6 12 8 12Z" fill={color} />
            <path d="M16 12C14 12 13 7 15.5 7C18 7 18 12 16 12Z" fill={color} />
            <path d="M8 13.5C8 15 10 18 12 18C14 18 16 15 16 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          </svg>
        );
      case 'WARM':
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 12.5C7.5 11 10 12 12 14C14 12 16.5 11 18 12.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M6 7C6 7 7 5 9.5 5C12 5 13 7 13 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M18 7C18 7 17 5 14.5 5C12 5 11 7 11 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12 14V19" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8.5 16.5L12 19L15.5 16.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          </svg>
        );
      case 'SUPPORTIVE':
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 8.5C17 7 15.5 5 12 5C8.5 5 7 7 7 8.5C7 10 8 11.5 10 11.5C10 11.5 10 13 12 13C14 13 14 11.5 14 11.5C16 11.5 17 10 17 8.5Z" stroke={color} strokeWidth="1.5" />
            <path d="M12 13V16" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8 18L12 16L16 18" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18.9999 7C18.9999 7 20.9999 9 20.9999 12C20.9999 16.5 16.9999 19.5 16.9999 19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M5 7C5 7 3 9 3 12C3 16.5 7 19.5 7 19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
          </svg>
        );
      case 'COMFORTING':
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" stroke={color} strokeWidth="1.5" />
            <path d="M7.5 9C7.5 9 8 7.5 9.5 7.5C11 7.5 11.5 9 11.5 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M12.5 9C12.5 9 13 7.5 14.5 7.5C16 7.5 16.5 9 16.5 9" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7.5 14C9 15.5 15 15.5 16.5 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8.5 11.5C8.5 11.5 10 12.5 12 12.5C14 12.5 15.5 11.5 15.5 11.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'ENCOURAGING':
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <path d="M8 9.5C8 9.5 9 8 12 8C15 8 16 9.5 16 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 14C8.5 16 15.5 16 17 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M8.5 12L12 15L15.5 12" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8.5 19.5L12 17L15.5 19.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'CELEBRATORY':
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <path d="M8 10C8 10 9.5 7 12 7C14.5 7 16 10 16 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 14.5C8.5 17 15.5 17 17 14.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.5 4.5L7 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19.5 4.5L17 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4.5 19.5L7 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M19.5 19.5L17 17" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={emojiSize} height={emojiSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke={color} strokeWidth="1.5" />
            <path d="M8 9.5C8 9.5 9 8 12 8C15 8 16 9.5 16 9.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M7 14C8.5 16 15.5 16 17 14" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
    }
  };
  
  return (
    <span className={`hug-emoji ${className}`}>
      {getHugIllustration()}
    </span>
  );
};

/**
 * SVG Icon for different hug types
 */
export const HugIcon = ({ type, size = 24, color }) => {
  const iconColor = color || HUG_COLORS[type] || '#4A90E2';
  const iconSize = size || 24;
  
  const renderIcon = () => {
    switch (type) {
      case 'QUICK':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 11H7C5.89543 11 5 10.1046 5 9V7C5 5.89543 5.89543 5 7 5H9C10.1046 5 11 5.89543 11 7V9C11 10.1046 10.1046 11 9 11Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 11H15C13.8954 11 13 10.1046 13 9V7C13 5.89543 13.8954 5 15 5H17C18.1046 5 19 5.89543 19 7V9C19 10.1046 18.1046 11 17 11Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 19H7C5.89543 19 5 18.1046 5 17V15C5 13.8954 5.89543 13 7 13H9C10.1046 13 11 13.8954 11 15V17C11 18.1046 10.1046 19 9 19Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17 19H15C13.8954 19 13 18.1046 13 17V15C13 13.8954 13.8954 13 15 13H17C18.1046 13 19 13.8954 19 15V17C19 18.1046 18.1046 19 17 19Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'WARM':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8C9.79086 8 8 9.79086 8 12C8 14.2091 9.79086 16 12 16Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V12L14 14" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'SUPPORTIVE':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 13C3.79086 13 2 14.7909 2 17V21H6V17" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18 13C20.2091 13 22 14.7909 22 17V21H18V17" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 16C14.2091 16 16 14.2091 16 12V9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9V12C8 14.2091 9.79086 16 12 16Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'COMFORTING':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="none" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'ENCOURAGING':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5L19 12L12 19" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'CELEBRATORY':
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 5V3" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 21V19" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12H3" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M21 12H19" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M17.657 6.343L16.243 7.757" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.757 16.243L6.343 17.657" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M16.243 16.243L17.657 17.657" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7.757 7.757L6.343 6.343" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width={iconSize} height={iconSize} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21 6C21 4.34315 19.6569 3 18 3H6C4.34315 3 3 4.34315 3 6V18C3 19.6569 4.34315 21 6 21H18C19.6569 21 21 19.6569 21 18V6Z" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9H21" stroke={iconColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  };
  
  return (
    <div className="hug-type-icon" style={{ color: iconColor }}>
      {renderIcon()}
    </div>
  );
};

/**
 * Component to display a colored label for hug type
 */
export const HugTypeLabel = ({ type, showIcon = true, showEmoji = true }) => {
  const color = HUG_COLORS[type] || '#4A90E2';
  const labelStyle = {
    backgroundColor: `${color}10`,
    color: color,
    borderLeft: `3px solid ${color}`,
    display: 'flex',
    alignItems: 'center',
    padding: '4px 8px',
    borderRadius: '0 4px 4px 0',
    margin: '4px 0',
    fontWeight: 'medium'
  };
  
  return (
    <div className="hug-type-label" style={labelStyle}>
      {showIcon && <HugIcon type={type} size={18} />}
      {showEmoji && <span className="hug-type-illustration" style={{marginRight: '6px', marginLeft: '2px'}}>
        <HugEmoji type={type} size={20} />
      </span>}
      <span style={{marginLeft: '4px'}}>
        {type?.charAt(0) + type?.slice(1).toLowerCase()}
      </span>
    </div>
  );
};

/**
 * Animated hug component that shows a visual animation
 * with cute immersive illustrations
 */
export const AnimatedHug = ({ type, speed = 'normal', size = 'medium' }) => {
  const color = HUG_COLORS[type] || '#4A90E2';
  const description = HUG_DESCRIPTIONS[type] || 'A warm hug';
  
  // Calculate animation speed
  const duration = speed === 'fast' ? '0.75s' : speed === 'slow' ? '1.5s' : '1s';
  
  // Calculate size
  const svgSize = size === 'small' ? 80 : size === 'large' ? 180 : 120;
  
  const animationStyle = {
    animation: `hugAnimation ${duration} ease-in-out infinite`,
    color: color
  };
  
  // Create an enhanced illustration for the animated hug
  const renderHugIllustration = () => {
    switch(type) {
      case 'WARM':
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <path d="M60 110C87.6142 110 110 87.6142 110 60C110 32.3858 87.6142 10 60 10C32.3858 10 10 32.3858 10 60C10 87.6142 32.3858 110 60 110Z" stroke={color} strokeWidth="3" />
            <path d="M40 55C43 51 50 53 60 60C70 53 77 51 80 55" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M35 30C35 30 40 24 50 24C60 24 65 30 65 30" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M85 30C85 30 80 24 70 24C60 24 55 30 55 30" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M60 60V90" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M45 80L60 90L75 80" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="40" cy="42" r="5" fill={color} opacity="0.6" />
            <circle cx="80" cy="42" r="5" fill={color} opacity="0.6" />
          </svg>
        );
      case 'SUPPORTIVE':
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="3" />
            <path d="M83 40C83 33 75 25 60 25C45 25 37 33 37 40C37 47 42 55 50 55C50 55 50 60 60 60C70 60 70 55 70 55C78 55 83 47 83 40Z" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M60 60V75" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M40 85L60 75L80 85" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M95 35C95 35 105 45 105 60C105 82 85 95 85 95" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M25 35C25 35 15 45 15 60C15 82 35 95 35 95" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M50 40C52 38 58 38 60 40C62 38 68 38 70 40" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'COMFORTING':
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <path d="M60 110C87.6142 110 110 87.6142 110 60C110 32.3858 87.6142 10 60 10C32.3858 10 10 32.3858 10 60C10 87.6142 32.3858 110 60 110Z" stroke={color} strokeWidth="3" />
            <path d="M35 45C35 45 40 35 48 35C56 35 59 45 59 45" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M61 45C61 45 64 35 72 35C80 35 85 45 85 45" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M35 70C45 80 75 80 85 70" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M42 55C42 55 50 60 60 60C70 60 78 55 78 55" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M48 82C48 82 54 90 60 90C66 90 72 82 72 82" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M60 60V70" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'ENCOURAGING':
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="3" />
            <path d="M40 45C40 45 45 35 60 35C75 35 80 45 80 45" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M35 70C42 80 78 80 85 70" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M42 55L60 70L78 55" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M40 95L60 80L80 95" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="45" cy="55" r="4" fill={color} opacity="0.7" />
            <circle cx="75" cy="55" r="4" fill={color} opacity="0.7" />
          </svg>
        );
      case 'CELEBRATORY':
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="3" />
            <path d="M40 45C40 45 48 30 60 30C72 30 80 45 80 45" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M35 70C42 85 78 85 85 70" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M22 22L35 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M98 22L85 35" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M22 98L35 85" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M98 98L85 85" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M46 42C46 42 50 50 60 50C70 50 74 42 74 42" stroke={color} strokeWidth="2" strokeLinecap="round" />
            <rect x="50" y="80" width="20" height="12" rx="6" fill={color} opacity="0.5" />
          </svg>
        );
      case 'QUICK':
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="3" />
            <path d="M42 55C48 55 52 30 42 30C32 30 36 55 42 55Z" fill={color} opacity="0.7" />
            <path d="M78 55C72 55 68 30 78 30C88 30 84 55 78 55Z" fill={color} opacity="0.7" />
            <path d="M40 65C40 75 45 90 60 90C75 90 80 75 80 65" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="42" cy="45" r="4" fill="white" />
            <circle cx="78" cy="45" r="4" fill="white" />
            <path d="M52 75C52 75 56 80 60 80C64 80 68 75 68 75" stroke={color} strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      default:
        return (
          <svg width={svgSize} height={svgSize} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" style={animationStyle}>
            <circle cx="60" cy="60" r="50" stroke={color} strokeWidth="3" />
            <path d="M40 40C40 40 45 30 60 30C75 30 80 40 80 40" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M35 70C42 80 78 80 85 70" stroke={color} strokeWidth="3" strokeLinecap="round" />
            <path d="M35 50L60 70L85 50" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M45 90C45 90 55 100 60 100C65 100 75 90 75 90" stroke={color} strokeWidth="3" strokeLinecap="round" />
          </svg>
        );
    }
  };
  
  return (
    <div className="animated-hug" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
      <div className="animated-hug-illustration" aria-label={description}>
        {renderHugIllustration()}
      </div>
      <style jsx="true">{`
        @keyframes hugAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default { HugEmoji, HugIcon, HugTypeLabel, AnimatedHug };