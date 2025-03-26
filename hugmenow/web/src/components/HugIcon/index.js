import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { getHugIconByType, getHugTypeColor, getHugTypeDisplayName } from '../../utils/hugIcons';

/**
 * Styled components for the HugIcon
 */
const IconContainer = styled(motion.div)`
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: ${props => props.margin || '0'};
  cursor: ${props => props.onClick ? 'pointer' : 'default'};
`;

const IconWrapper = styled(motion.div)`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${props => {
    switch (props.size) {
      case 'xs': return '24px';
      case 'sm': return '32px';
      case 'md': return '48px';
      case 'lg': return '64px';
      case 'xl': return '96px';
      default: return props.size || '48px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'xs': return '24px';
      case 'sm': return '32px';
      case 'md': return '48px';
      case 'lg': return '64px';
      case 'xl': return '96px';
      default: return props.size || '48px';
    }
  }};
  background-color: ${props => props.showBackground ? '#ffffff' : 'transparent'};
  border-radius: 50%;
  padding: ${props => props.showBackground ? '8px' : '0'};
  border: ${props => props.isSelected ? `2px solid ${props.color || '#4a90e2'}` : 'none'};
  box-shadow: ${props => props.isSelected ? '0 0 10px rgba(0,0,0,0.1)' : 'none'};
`;

const StyledIcon = styled.img`
  width: 100%;
  height: 100%;
`;

const IconLabel = styled.span`
  margin-top: 8px;
  font-size: 0.9rem;
  color: #333;
  text-align: center;
`;

/**
 * Animation variants for the HugIcon
 */
const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.1 },
  tap: { scale: 0.95 },
  selected: { 
    scale: 1.05,
    transition: { 
      type: 'spring',
      stiffness: 400,
      damping: 10
    }
  }
};

/**
 * HugIcon Component
 * Displays a hug icon with optional label and animations
 */
const HugIcon = ({
  /** Type of hug icon to display */
  type = 'standard',
  /** Size of the icon */
  size = 'md',
  /** Whether to show the label below the icon */
  showLabel = false,
  /** Whether to show a background behind the icon */
  showBackground = false,
  /** Whether the icon should be highlighted */
  isSelected = false,
  /** Whether to apply animations to the icon */
  animate = true,
  /** CSS margin value */
  margin,
  /** Click handler for the icon */
  onClick
}) => {
  // Get the icon source and color based on the type
  const iconSrc = getHugIconByType(type);
  const color = getHugTypeColor(type);
  const name = getHugTypeDisplayName(type);

  return (
    <IconContainer 
      margin={margin}
      onClick={onClick}
      data-testid={`hug-icon-${type}`}
    >
      <IconWrapper 
        size={size}
        showBackground={showBackground}
        isSelected={isSelected}
        color={color}
        initial="initial"
        whileHover={animate ? "hover" : ""}
        whileTap={animate ? "tap" : ""}
        animate={isSelected && animate ? "selected" : "initial"}
        variants={animate ? iconVariants : {}}
      >
        <StyledIcon 
          src={iconSrc} 
          alt={`${name} icon`} 
        />
      </IconWrapper>
      
      {showLabel && (
        <IconLabel>{name}</IconLabel>
      )}
    </IconContainer>
  );
};

HugIcon.propTypes = {
  type: PropTypes.oneOf(['standard', 'supportive', 'group', 'comforting', 'enthusiastic', 'virtual']),
  size: PropTypes.oneOfType([
    PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),
    PropTypes.string
  ]),
  showLabel: PropTypes.bool,
  showBackground: PropTypes.bool,
  isSelected: PropTypes.bool,
  animate: PropTypes.bool,
  margin: PropTypes.string,
  onClick: PropTypes.func
};

export default HugIcon;