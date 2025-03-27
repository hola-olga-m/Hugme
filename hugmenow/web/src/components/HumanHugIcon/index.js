/**
 * HumanHugIcon Component
 * 
 * This component displays human-figured hug icons with animations.
 * It supports both static display and animated display modes.
 */

import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { HUG_TYPES, HUG_ICONS, getHugAnimationFrames, getAnimationType } from '../../utils/humanHugIcons';

// Styled components for the HumanHugIcon
const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: ${props => props.onClick ? 'scale(1.05)' : 'none'};
  }
`;

const IconWrapper = styled.div`
  width: ${props => props.size || '120px'};
  height: ${props => props.size || '120px'};
  border-radius: ${props => props.circular ? '50%' : '12px'};
  overflow: hidden;
  background-color: ${props => props.backgroundColor || 'transparent'};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const IconImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const IconCaption = styled.div`
  font-size: 14px;
  text-align: center;
  color: ${props => props.selected ? '#ff6b8b' : '#666'};
  font-weight: ${props => props.selected ? 'bold' : 'normal'};
  margin-top: 8px;
`;

/**
 * HumanHugIcon Component
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of hug (one of HUG_TYPES keys or values)
 * @param {string} props.size - Size of the icon (e.g., '120px', '200px')
 * @param {boolean} props.circular - Whether to display the icon in a circular shape
 * @param {boolean} props.animated - Whether to animate the icon
 * @param {boolean} props.showCaption - Whether to show the caption
 * @param {boolean} props.selected - Whether the icon is selected (affects caption style)
 * @param {Function} props.onClick - Click handler for the icon
 */
const HumanHugIcon = ({ 
  type = HUG_TYPES.BEAR_HUG, 
  variant = 1,
  size = '120px', 
  circular = false, 
  animated = false, 
  showCaption = true, 
  selected = false, 
  onClick = null,
  backgroundColor = 'transparent'
}) => {
  // State for tracking animation
  const [currentFrame, setCurrentFrame] = useState(0);
  const [animationFrames, setAnimationFrames] = useState([]);
  const animationRef = useRef(null);
  
  // Normalize the type to ensure it's a valid hug type
  const normalizedType = Object.values(HUG_TYPES).includes(type) ? type : HUG_TYPES.BEAR_HUG;
  
  // Ensure variant is between 1 and 4
  const normalizedVariant = Math.min(Math.max(variant, 1), 4);
  
  // Get the specific icon information
  const iconInfo = HUG_ICONS[normalizedType]?.find(icon => icon.variant === normalizedVariant) || 
                  HUG_ICONS[HUG_TYPES.BEAR_HUG][0];
  
  // Format the display name by adding spaces
  const displayName = normalizedType.replace(/([A-Z])/g, ' $1').trim();
  
  // Set up animation frames when animated prop changes
  useEffect(() => {
    if (animated) {
      const frames = getHugAnimationFrames(normalizedType, normalizedVariant);
      setAnimationFrames(frames);
      
      // Start animation loop
      const runAnimation = () => {
        setCurrentFrame(prev => (prev + 1) % frames.length);
        animationRef.current = requestAnimationFrame(runAnimation);
      };
      
      animationRef.current = requestAnimationFrame(runAnimation);
      
      // Clean up animation loop when component unmounts or animated changes
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      // Stop animation if disabled
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      setAnimationFrames([]);
    }
  }, [animated, normalizedType, normalizedVariant]);
  
  // Determine the source of the image (static or animated frame)
  const imageSrc = animated && animationFrames.length > 0 
    ? animationFrames[currentFrame] 
    : iconInfo.static;
  
  return (
    <IconContainer onClick={onClick}>
      <IconWrapper 
        size={size} 
        circular={circular}
        backgroundColor={backgroundColor}
      >
        <IconImage 
          src={imageSrc} 
          alt={`${displayName} hug icon`} 
        />
      </IconWrapper>
      
      {showCaption && (
        <IconCaption selected={selected}>
          {displayName}
        </IconCaption>
      )}
    </IconContainer>
  );
};

export default HumanHugIcon;