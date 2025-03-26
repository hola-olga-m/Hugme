import React from 'react';

// Map of hug types to emojis
const HUG_EMOJIS = {
  QUICK: '👋',
  WARM: '🤗',
  SUPPORTIVE: '💪',
  COMFORTING: '💙',
  ENCOURAGING: '💫',
  CELEBRATORY: '🎉'
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
 * Component to display hug emoji based on type
 */
export const HugEmoji = ({ type, className = '' }) => {
  return (
    <span className={`hug-emoji ${className}`}>{HUG_EMOJIS[type] || '🤗'}</span>
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
    borderLeft: `3px solid ${color}`
  };
  
  return (
    <div className="hug-type-label" style={labelStyle}>
      {showIcon && <HugIcon type={type} size={18} />}
      {showEmoji && <span className="hug-type-emoji">{HUG_EMOJIS[type]}</span>}
      {type?.charAt(0) + type?.slice(1).toLowerCase()}
    </div>
  );
};

/**
 * Animated hug component that shows a visual animation
 */
export const AnimatedHug = ({ type, speed = 'normal', size = 'medium' }) => {
  const emoji = HUG_EMOJIS[type] || '🤗';
  const color = HUG_COLORS[type] || '#4A90E2';
  
  // Calculate animation speed
  const duration = speed === 'fast' ? '0.75s' : speed === 'slow' ? '1.5s' : '1s';
  
  // Calculate size
  const emojiSize = size === 'small' ? '2rem' : size === 'large' ? '4rem' : '3rem';
  
  const animationStyle = {
    animation: `hugAnimation ${duration} ease-in-out infinite`,
    fontSize: emojiSize,
    color: color
  };
  
  return (
    <div className="animated-hug" style={{ textAlign: 'center', margin: '1.5rem 0' }}>
      <span className="animated-hug-emoji" style={animationStyle}>
        {emoji}
      </span>
      <style jsx="true">{`
        @keyframes hugAnimation {
          0% { transform: scale(1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default { HugEmoji, HugIcon, HugTypeLabel, AnimatedHug };