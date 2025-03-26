import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getHugIconByType, getHugTypeColor, getHugTypeDisplayName } from '../../utils/hugIcons';

/**
 * Styled components for the HugIcon
 */
const HugIconContainer = styled(motion.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '0.5rem' : '1rem'};
  margin: ${props => props.margin || '0.5rem'};
  border-radius: 12px;
  background-color: ${props => props.showBackground ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
  transition: all 0.2s ease-in-out;
  
  &:hover {
    background-color: ${props => props.onClick ? 'rgba(255, 255, 255, 0.2)' : props.showBackground ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};
    transform: ${props => props.onClick ? 'scale(1.05)' : 'none'};
  }
`;

const IconImage = styled.img`
  width: ${props => {
    switch (props.size) {
      case 'tiny': return '24px';
      case 'small': return '32px';
      case 'medium': return '48px';
      case 'large': return '64px';
      case 'xlarge': return '96px';
      default: return '48px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'tiny': return '24px';
      case 'small': return '32px';
      case 'medium': return '48px';
      case 'large': return '64px';
      case 'xlarge': return '96px';
      default: return '48px';
    }
  }};
  object-fit: contain;
  filter: ${props => props.highlighted ? 'drop-shadow(0 0 8px ' + props.accentColor + ')' : 'none'};
`;

const HugLabel = styled.span`
  font-size: ${props => props.size === 'small' || props.size === 'tiny' ? '0.75rem' : '0.875rem'};
  color: ${props => props.theme.textSecondary};
  margin-top: 0.5rem;
  text-align: center;
  font-weight: ${props => props.highlighted ? '600' : '400'};
  display: ${props => props.showLabel ? 'block' : 'none'};
`;

/**
 * Animation variants for the HugIcon
 */
const iconAnimations = {
  hover: {
    scale: 1.1,
    transition: { duration: 0.2 }
  },
  tap: {
    scale: 0.95,
    transition: { duration: 0.1 }
  }
};

/**
 * HugIcon Component
 * Displays a hug icon with optional label and animations
 */
const HugIcon = ({ 
  type = 'standard', 
  size = 'medium', 
  showLabel = false, 
  showBackground = false, 
  highlighted = false,
  animate = true, 
  margin,
  onClick,
  ...props 
}) => {
  const iconSrc = getHugIconByType(type);
  const accentColor = getHugTypeColor(type);
  const displayName = getHugTypeDisplayName(type);
  
  const handleClick = () => {
    if (onClick) onClick(type);
  };

  return (
    <HugIconContainer 
      size={size}
      margin={margin}
      showBackground={showBackground}
      onClick={onClick ? handleClick : undefined}
      whileHover={animate && onClick ? 'hover' : undefined}
      whileTap={animate && onClick ? 'tap' : undefined}
      variants={iconAnimations}
      {...props}
    >
      <IconImage 
        src={iconSrc} 
        alt={displayName}
        size={size}
        highlighted={highlighted}
        accentColor={accentColor}
      />
      
      {showLabel && (
        <HugLabel 
          size={size} 
          highlighted={highlighted}
          showLabel={showLabel}
        >
          {displayName}
        </HugLabel>
      )}
    </HugIconContainer>
  );
};

HugIcon.propTypes = {
  /** Type of hug icon to display */
  type: PropTypes.oneOf(['standard', 'supportive', 'group', 'comforting', 'enthusiastic', 'virtual']),
  /** Size of the icon */
  size: PropTypes.oneOf(['tiny', 'small', 'medium', 'large', 'xlarge']),
  /** Whether to show the label below the icon */
  showLabel: PropTypes.bool,
  /** Whether to show a background behind the icon */
  showBackground: PropTypes.bool,
  /** Whether the icon should be highlighted */
  highlighted: PropTypes.bool,
  /** Whether to apply animations to the icon */
  animate: PropTypes.bool,
  /** CSS margin value */
  margin: PropTypes.string,
  /** Click handler for the icon */
  onClick: PropTypes.func
};

export default HugIcon;