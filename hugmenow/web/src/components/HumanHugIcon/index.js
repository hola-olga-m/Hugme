/**
 * HumanHugIcon Component
 * 
 * This component displays human-figured hug icons.
 * Simplified version to avoid circular dependencies.
 */

import React from 'react';
import styled from 'styled-components';
// Import the reference image directly
import referenceImage from '../../assets/icons/reference-hugs.png';

// Hug types based on the reference grid image
export const HUG_TYPES = {
  BEAR_HUG: 'BearHug',
  SUPPORTING: 'Supporting',
  COMFORTING: 'Comforting',
  LOVING: 'Loving',
  CELEBRATING: 'Celebrating',
  FESTIVE: 'Festive',
  CARING: 'Caring',
  TEASING: 'Teasing',
  INVITING: 'Inviting',
  MOODY: 'Moody'
};

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
 * HumanHugIcon Component - Simplified version
 * 
 * @param {Object} props - Component props
 * @param {string} props.type - Type of hug
 * @param {string} props.size - Size of the icon (e.g., '120px', '200px')
 * @param {boolean} props.circular - Whether to display the icon in a circular shape
 * @param {boolean} props.showCaption - Whether to show the caption
 * @param {boolean} props.selected - Whether the icon is selected (affects caption style)
 * @param {Function} props.onClick - Click handler for the icon
 */
const HumanHugIcon = ({ 
  type = HUG_TYPES.BEAR_HUG,
  size = '120px', 
  circular = false, 
  showCaption = true, 
  selected = false, 
  onClick = null,
  backgroundColor = 'transparent'
}) => {
  // Format the display name by adding spaces
  const displayName = type.replace(/([A-Z])/g, ' $1').trim();
  
  // Use the imported reference image
  const imageSrc = referenceImage;
  
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