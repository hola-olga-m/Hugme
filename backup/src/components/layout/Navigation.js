import React from 'react';
import { Link } from 'react-router-dom';

const Navigation = ({ currentPath }) => {
  // Navigation items
  const navItems = [
    {
      path: '/dashboard',
      icon: 'fa-home',
      label: 'Home'
    },
    {
      path: '/mood/track',
      icon: 'fa-smile',
      label: 'Mood'
    },
    {
      path: '/hug/send',
      icon: 'fa-heart',
      label: 'Hug'
    },
    {
      path: '/group-hug',
      icon: 'fa-users',
      label: 'Group'
    },
    {
      path: '/community',
      icon: 'fa-globe',
      label: 'Community'
    }
  ];

  // Check if a path is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <nav className="mobile-navigation">
      <div className="nav-container">
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            to={item.path} 
            className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <i className={`fas ${item.icon}`}></i>
            <span className="nav-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navigation;