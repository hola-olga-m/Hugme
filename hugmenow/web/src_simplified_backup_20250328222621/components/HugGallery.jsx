import React from 'react';
import { HugEmoji, HugTypeLabel, HUG_COLORS, HUG_DESCRIPTIONS } from './HugIcons';

const HugGallery = ({ selectedType, onSelectHug }) => {
  const hugTypes = ['QUICK', 'WARM', 'SUPPORTIVE', 'COMFORTING', 'ENCOURAGING', 'CELEBRATORY'];
  
  return (
    <div className="hug-gallery" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
      marginTop: '20px'
    }}>
      {hugTypes.map(type => {
        const isSelected = selectedType === type;
        const hugColor = HUG_COLORS[type] || '#4A90E2';
        
        return (
          <div 
            key={type}
            className={`hug-card ${isSelected ? 'selected' : ''}`}
            onClick={() => onSelectHug(type)}
            style={{ 
              color: isSelected ? hugColor : 'inherit',
              backgroundColor: isSelected ? `${hugColor}10` : 'white',
              borderRadius: '16px',
              padding: '20px',
              boxShadow: isSelected 
                ? `0 8px 20px ${hugColor}30` 
                : '0 4px 12px rgba(0, 0, 0, 0.05)',
              border: isSelected 
                ? `2px solid ${hugColor}` 
                : '1px solid rgba(0, 0, 0, 0.08)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            {/* Decorative background */}
            {isSelected && (
              <div 
                className="hug-card-decoration" 
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  width: '100%',
                  height: '100%',
                  opacity: 0.1,
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              >
                <svg width="100%" height="100%" viewBox="0 0 200 200" fill="none">
                  <circle cx="180" cy="20" r="60" fill={hugColor} />
                  <circle cx="20" cy="180" r="40" fill={hugColor} />
                </svg>
              </div>
            )}
            
            <div className="hug-card-icon" style={{
              marginBottom: '12px',
              position: 'relative',
              zIndex: 1
            }}>
              <HugEmoji type={type} size={80} />
            </div>
            
            <h4 className="hug-card-title" style={{
              margin: '8px 0',
              fontSize: '1.2rem',
              fontWeight: 'bold',
              color: hugColor,
              position: 'relative',
              zIndex: 1
            }}>
              {type.charAt(0) + type.slice(1).toLowerCase()} Hug
            </h4>
            
            <p className="hug-card-description" style={{
              margin: '8px 0',
              fontSize: '0.9rem',
              lineHeight: '1.4',
              opacity: 0.8,
              position: 'relative',
              zIndex: 1
            }}>
              {HUG_DESCRIPTIONS[type]}
            </p>
            
            {isSelected && (
              <div className="hug-card-selected-indicator" style={{
                marginTop: '12px',
                padding: '6px 12px',
                backgroundColor: hugColor,
                color: 'white',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold',
                position: 'relative',
                zIndex: 1
              }}>
                Selected
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default HugGallery;