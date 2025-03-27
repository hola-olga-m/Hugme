import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Import SVG icons
import { ReactComponent as LogoIcon } from '../../assets/icons/logo.svg';
import { ReactComponent as HugIcon } from '../../assets/icons/hug.svg';
import { ReactComponent as MoodIcon } from '../../assets/icons/mood.svg';
import { ReactComponent as NotificationIcon } from '../../assets/icons/notification.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { ReactComponent as ProfileIcon } from '../../assets/icons/profile.svg';
import { ReactComponent as DashboardIcon } from '../../assets/icons/dashboard.svg';

const IconWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${props => props.size || '24px'};
  height: ${props => props.size || '24px'};
  color: ${props => props.color || 'currentColor'};
  transition: transform 0.2s ease, opacity 0.2s ease;
  
  &:hover {
    opacity: ${props => props.hoverOpacity || 0.8};
    transform: ${props => props.hoverScale ? `scale(${props.hoverScale})` : 'none'};
  }
  
  & > svg {
    width: 100%;
    height: 100%;
  }
`;

/**
 * Icon component that renders various SVG icons with consistent styling
 * 
 * @param {Object} props - Component props
 * @param {string} props.name - Icon name to render
 * @param {string} [props.size='24px'] - Icon size (width and height)
 * @param {string} [props.color] - Icon color
 * @param {number} [props.hoverOpacity=0.8] - Opacity on hover
 * @param {number} [props.hoverScale] - Scale on hover (e.g., 1.1)
 * @param {Object} [props.style] - Additional inline styles
 * @returns {React.ReactElement} Rendered icon
 */
const Icon = ({ name, size, color, hoverOpacity, hoverScale, style, ...rest }) => {
  const iconComponents = {
    logo: LogoIcon,
    hug: HugIcon,
    mood: MoodIcon,
    notification: NotificationIcon,
    settings: SettingsIcon,
    profile: ProfileIcon,
    dashboard: DashboardIcon,
  };

  const IconComponent = iconComponents[name.toLowerCase()];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return (
    <IconWrapper 
      size={size} 
      color={color} 
      hoverOpacity={hoverOpacity} 
      hoverScale={hoverScale}
      style={style}
      data-testid={`icon-${name}`}
      {...rest}
    >
      <IconComponent />
    </IconWrapper>
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.string,
  color: PropTypes.string,
  hoverOpacity: PropTypes.number,
  hoverScale: PropTypes.number,
  style: PropTypes.object,
};

export default Icon;