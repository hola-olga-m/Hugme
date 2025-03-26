import React from 'react';
import { HugIcon, HugEmoji } from './HugIcons';

const HUG_DESCRIPTIONS = {
  QUICK: 'A friendly, brief embrace to brighten the day',
  WARM: 'A tender, heartfelt hug to share affection',
  SUPPORTIVE: 'A strong, reassuring hug that offers strength',
  COMFORTING: 'A gentle, soothing hug during difficult times',
  ENCOURAGING: 'An energizing hug to motivate and inspire',
  CELEBRATORY: 'A joyful hug to share in life\'s exciting moments'
};

const HugGallery = ({ selectedType, onSelectHug }) => {
  const hugTypes = ['QUICK', 'WARM', 'SUPPORTIVE', 'COMFORTING', 'ENCOURAGING', 'CELEBRATORY'];
  
  return (
    <div className="hug-gallery">
      {hugTypes.map(type => (
        <div 
          key={type}
          className={`hug-card ${selectedType === type ? 'selected' : ''}`}
          onClick={() => onSelectHug(type)}
          style={{ color: selectedType === type ? getHugColor(type) : 'inherit' }}
        >
          <div className="hug-card-icon">
            <HugIcon type={type} />
          </div>
          <h4 className="hug-card-title">
            {getHugTitle(type)} <HugEmoji type={type} />
          </h4>
          <p className="hug-card-description">
            {HUG_DESCRIPTIONS[type]}
          </p>
        </div>
      ))}
    </div>
  );
};

// Helper functions
const getHugTitle = (type) => {
  const displayType = type?.charAt(0) + type?.slice(1).toLowerCase();
  return `${displayType} Hug`;
};

const getHugColor = (type) => {
  const colors = {
    QUICK: '#4A90E2',
    WARM: '#FF6B6B',
    SUPPORTIVE: '#4285F4',
    COMFORTING: '#9D65C9',
    ENCOURAGING: '#FFC857',
    CELEBRATORY: '#4ADE80'
  };
  return colors[type] || colors.QUICK;
};

export default HugGallery;