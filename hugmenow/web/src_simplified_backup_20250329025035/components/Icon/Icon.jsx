import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

// Import standard SVG icons
import { ReactComponent as LogoIcon } from '../../assets/icons/logo.svg';
import { ReactComponent as HugIcon } from '../../assets/icons/hug.svg';
import { ReactComponent as MoodIcon } from '../../assets/icons/mood.svg';
import { ReactComponent as NotificationIcon } from '../../assets/icons/notification.svg';
import { ReactComponent as SettingsIcon } from '../../assets/icons/settings.svg';
import { ReactComponent as ProfileIcon } from '../../assets/icons/profile.svg';
import { ReactComponent as DashboardIcon } from '../../assets/icons/dashboard.svg';
import { ReactComponent as HomeIcon } from '../../assets/icons/home.svg';
import { ReactComponent as CommunityIcon } from '../../assets/icons/community.svg';
import { ReactComponent as CalendarIcon } from '../../assets/icons/calendar.svg';
import { ReactComponent as ThemeIcon } from '../../assets/icons/theme.svg';

// Import hug type icons
import { ReactComponent as SupportiveHugIcon } from '../../assets/icons/hug-types/supportive-hug.svg';
import { ReactComponent as ComfortHugIcon } from '../../assets/icons/hug-types/comfort-hug.svg';
import { ReactComponent as CelebrationHugIcon } from '../../assets/icons/hug-types/celebration-hug.svg';

// Import hug gallery icons
import { ReactComponent as FriendshipHugIcon } from '../../assets/icons/hug-gallery/friendship-hug.svg';
import { ReactComponent as HealingHugIcon } from '../../assets/icons/hug-gallery/healing-hug.svg';
import { ReactComponent as EncouragementHugIcon } from '../../assets/icons/hug-gallery/encouragement-hug.svg';
import { ReactComponent as LoveHugIcon } from '../../assets/icons/hug-gallery/love-hug.svg';
import { ReactComponent as GratitudeHugIcon } from '../../assets/icons/hug-gallery/gratitude-hug.svg';

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
 * @param {string} [props.category] - Icon category (standard, hugType, hugGallery)
 * @returns {React.ReactElement} Rendered icon
 */
const Icon = ({ 
  name, 
  size, 
  color, 
  hoverOpacity, 
  hoverScale, 
  style,
  category = 'standard',
  ...rest 
}) => {
  // Standard UI icons
  const standardIcons = {
    logo: LogoIcon,
    hug: HugIcon,
    mood: MoodIcon,
    notification: NotificationIcon,
    settings: SettingsIcon,
    profile: ProfileIcon,
    dashboard: DashboardIcon,
    home: HomeIcon,
    community: CommunityIcon,
    calendar: CalendarIcon,
    theme: ThemeIcon,
  };
  
  // Hug type icons (medium size)
  const hugTypeIcons = {
    'supportive-hug': SupportiveHugIcon,
    'comfort-hug': ComfortHugIcon,
    'celebration-hug': CelebrationHugIcon,
  };
  
  // Hug gallery icons (large, detailed)
  const hugGalleryIcons = {
    'friendship-hug': FriendshipHugIcon,
    'healing-hug': HealingHugIcon,
    'encouragement-hug': EncouragementHugIcon,
    'love-hug': LoveHugIcon,
    'gratitude-hug': GratitudeHugIcon,
  };
  
  // Select the appropriate icon set based on category
  let iconComponents;
  switch(category) {
    case 'hugType':
      iconComponents = hugTypeIcons;
      break;
    case 'hugGallery':
      iconComponents = hugGalleryIcons;
      break;
    case 'standard':
    default:
      iconComponents = standardIcons;
  }

  const IconComponent = iconComponents[name.toLowerCase()];

  if (!IconComponent) {
    console.warn(`Icon "${name}" not found in category "${category}"`);
    return null;
  }

  return (
    <IconWrapper 
      size={size} 
      color={color} 
      hoverOpacity={hoverOpacity} 
      hoverScale={hoverScale}
      style={style}
      data-testid={`icon-${category}-${name}`}
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
  category: PropTypes.oneOf(['standard', 'hugType', 'hugGallery']),
};

export default Icon;