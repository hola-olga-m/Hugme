import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from '../Icon/Icon';

const ButtonWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.padding || '8px'};
  border-radius: ${props => props.rounded ? '50%' : props.borderRadius || '4px'};
  border: ${props => props.variant === 'outlined' 
    ? `1px solid ${props.borderColor || props.theme.colors.primary}`
    : 'none'
  };
  background-color: ${props => {
    if (props.variant === 'text' || props.variant === 'outlined') return 'transparent';
    if (props.backgroundColor) return props.backgroundColor;
    return props.theme.colors.primary;
  }};
  color: ${props => {
    if (props.variant === 'text' || props.variant === 'outlined') {
      return props.color || props.theme.colors.primary;
    }
    return props.color || props.theme.colors.white;
  }};
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.6 : 1};
  pointer-events: ${props => props.disabled ? 'none' : 'auto'};
  box-shadow: ${props => props.elevation ? props.theme.shadows[props.elevation] : 'none'};
  
  &:hover {
    background-color: ${props => {
      if (props.variant === 'text' || props.variant === 'outlined') {
        return props.theme.colors.backgroundHover;
      }
      if (props.hoverBackgroundColor) return props.hoverBackgroundColor;
      return props.theme.colors.primaryDark;
    }};
    transform: ${props => props.hoverScale ? `scale(${props.hoverScale})` : 'none'};
    box-shadow: ${props => props.elevation && props.elevation < 3 
      ? props.theme.shadows[props.elevation + 1]
      : props.elevation ? props.theme.shadows[props.elevation] : 'none'
    };
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

/**
 * IconButton component that renders an icon within a button element
 * 
 * @param {Object} props - Component props
 * @param {string} props.iconName - Name of the icon to display
 * @param {string} [props.iconCategory='standard'] - Category of icon ('standard', 'hugType', or 'hugGallery')
 * @param {string} [props.size='24px'] - Size of the icon
 * @param {string} [props.iconColor] - Color of the icon
 * @param {string} [props.backgroundColor] - Background color of the button
 * @param {string} [props.hoverBackgroundColor] - Background color on hover
 * @param {string} [props.padding='8px'] - Padding around the icon
 * @param {string} [props.borderRadius='4px'] - Border radius of the button
 * @param {boolean} [props.rounded=false] - Makes the button circular
 * @param {string} [props.variant='contained'] - Button variant (contained, outlined, text)
 * @param {boolean} [props.disabled=false] - Disables the button
 * @param {number} [props.hoverScale] - Scale factor on hover
 * @param {number} [props.elevation] - Elevation level (0-4) for shadow depth
 * @param {Function} [props.onClick] - Click handler function
 * @param {string} [props.ariaLabel] - Accessibility label
 * @returns {React.ReactElement} Rendered icon button
 */
const IconButton = ({
  iconName,
  iconCategory = 'standard',
  size = '24px',
  iconColor,
  backgroundColor,
  hoverBackgroundColor,
  padding,
  borderRadius,
  rounded = false,
  variant = 'contained',
  disabled = false,
  hoverScale,
  elevation,
  onClick,
  ariaLabel,
  ...rest
}) => {
  return (
    <ButtonWrapper
      padding={padding}
      borderRadius={borderRadius}
      rounded={rounded}
      variant={variant}
      backgroundColor={backgroundColor}
      hoverBackgroundColor={hoverBackgroundColor}
      disabled={disabled}
      hoverScale={hoverScale}
      elevation={elevation}
      onClick={onClick}
      aria-label={ariaLabel || `${iconName} button`}
      {...rest}
    >
      <Icon 
        name={iconName} 
        category={iconCategory}
        size={size} 
        color={iconColor}
      />
    </ButtonWrapper>
  );
};

IconButton.propTypes = {
  iconName: PropTypes.string.isRequired,
  iconCategory: PropTypes.oneOf(['standard', 'hugType', 'hugGallery']),
  size: PropTypes.string,
  iconColor: PropTypes.string,
  backgroundColor: PropTypes.string,
  hoverBackgroundColor: PropTypes.string,
  padding: PropTypes.string,
  borderRadius: PropTypes.string,
  rounded: PropTypes.bool,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  disabled: PropTypes.bool,
  hoverScale: PropTypes.number,
  elevation: PropTypes.oneOf([0, 1, 2, 3, 4]),
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export default IconButton;