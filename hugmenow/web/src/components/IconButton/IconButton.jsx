import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import Icon from '../Icon';

const ButtonWrapper = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${props => props.padding || '8px'};
  border-radius: ${props => props.rounded ? '50%' : '8px'};
  border: none;
  background-color: ${props => props.variant === 'contained' 
    ? props.color || 'var(--primary)'
    : 'transparent'};
  color: ${props => props.variant === 'contained' 
    ? 'var(--text-on-primary)' 
    : props.color || 'var(--primary)'};
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'outlined' && `
    border: 1.5px solid ${props.color || 'var(--primary)'};
  `}
  
  &:hover {
    transform: ${props => props.scale ? `scale(${props.scale})` : 'scale(1.05)'};
    opacity: 0.9;
    
    ${props => props.variant === 'contained' && `
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    `}
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px var(--focus-ring);
  }
  
  /* Optional ripple effect on click */
  ${props => props.ripple && `
    &:after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.4) 10%, transparent 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10, 10);
      opacity: 0;
      transition: transform 0.5s, opacity 0.8s;
    }
    
    &:active:after {
      transform: scale(0, 0);
      opacity: 0.3;
      transition: 0s;
    }
  `}
  
  /* Add space between icon and label if both exist */
  & > span {
    margin-left: ${props => props.iconName ? '8px' : '0'};
  }
`;

/**
 * IconButton component for interactive buttons with icons
 * 
 * @param {Object} props - Component props
 * @param {string} [props.iconName] - Name of the icon to display
 * @param {string} [props.label] - Text label for the button
 * @param {string} [props.variant='contained'] - Button style variant: 'contained', 'outlined', or 'text'
 * @param {string} [props.color] - Primary color for the button
 * @param {string} [props.iconSize='18px'] - Size of the icon
 * @param {boolean} [props.rounded=false] - Whether to use a circular button
 * @param {boolean} [props.ripple=true] - Whether to show ripple effect on click
 * @param {function} [props.onClick] - Click handler function
 * @param {boolean} [props.disabled=false] - Whether the button is disabled
 * @param {string} [props.padding='8px'] - Button padding
 * @param {number} [props.scale=1.05] - Hover scale effect
 * @returns {React.ReactElement} Rendered IconButton
 */
const IconButton = ({
  iconName,
  label,
  variant = 'contained',
  color,
  iconSize = '18px',
  rounded = false,
  ripple = true,
  onClick,
  disabled = false,
  padding,
  scale,
  ...rest
}) => {
  return (
    <ButtonWrapper
      variant={variant}
      color={color}
      onClick={onClick}
      disabled={disabled}
      rounded={rounded}
      ripple={ripple}
      padding={padding}
      scale={scale}
      aria-label={label || iconName}
      {...rest}
    >
      {iconName && (
        <Icon 
          name={iconName} 
          size={iconSize} 
          color={variant === 'contained' ? 'inherit' : color} 
        />
      )}
      {label && <span>{label}</span>}
    </ButtonWrapper>
  );
};

IconButton.propTypes = {
  iconName: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(['contained', 'outlined', 'text']),
  color: PropTypes.string,
  iconSize: PropTypes.string,
  rounded: PropTypes.bool,
  ripple: PropTypes.bool,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  padding: PropTypes.string,
  scale: PropTypes.number,
};

export default IconButton;