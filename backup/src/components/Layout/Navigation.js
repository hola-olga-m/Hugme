import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';

/**
 * Mobile navigation bar for the bottom of the screen
 */
const Navigation = () => {
  const location = useLocation();

  // Check if current path matches
  const isActive = (path) => {
    if (path === '/app' && (location.pathname === '/app' || location.pathname === '/app/dashboard')) {
      return true;
    }
    return location.pathname === path || 
           (path !== '/' && path !== '/app' && location.pathname.startsWith(path));
  };
  
  // Get icon and class based on route
  const getNavItemProps = (path) => {
    let icon = '';
    let label = '';
    
    switch (path) {
      case '/app':
        icon = '🏠';
        label = 'Dashboard';
        break;
      case '/app/mood':
        icon = '📊';
        label = 'Mood';
        break;
      case '/app/hugs':
        icon = '🤗';
        label = 'Hugs';
        break;
      case '/app/community':
        icon = '👥';
        label = 'Community';
        break;
      case '/app/profile':
        icon = '👤';
        label = 'Profile';
        break;
      default:
        icon = '📱';
        label = 'Menu';
    }
    
    return { icon, label, className: isActive(path) ? 'active' : '' };
  };

  return (
    <nav className="mobile-navigation">
      <NavLink to="/app" className={getNavItemProps('/app').className}>
        <span className="icon">{getNavItemProps('/app').icon}</span>
        <span className="label">{getNavItemProps('/app').label}</span>
      </NavLink>
      
      <NavLink to="/app/mood" className={getNavItemProps('/app/mood').className}>
        <span className="icon">{getNavItemProps('/app/mood').icon}</span>
        <span className="label">{getNavItemProps('/app/mood').label}</span>
      </NavLink>
      
      <NavLink to="/app/hugs/send" className={getNavItemProps('/app/hugs').className}>
        <span className="icon">{getNavItemProps('/app/hugs').icon}</span>
        <span className="label">{getNavItemProps('/app/hugs').label}</span>
      </NavLink>
      
      <NavLink to="/app/community" className={getNavItemProps('/app/community').className}>
        <span className="icon">{getNavItemProps('/app/community').icon}</span>
        <span className="label">{getNavItemProps('/app/community').label}</span>
      </NavLink>
      
      <NavLink to="/app/profile" className={getNavItemProps('/app/profile').className}>
        <span className="icon">{getNavItemProps('/app/profile').icon}</span>
        <span className="label">{getNavItemProps('/app/profile').label}</span>
      </NavLink>
    </nav>
  );
};

export default Navigation;