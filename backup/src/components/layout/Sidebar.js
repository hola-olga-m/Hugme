import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Sidebar = ({ isOpen, isMobile, closeSidebar }) => {
  const { currentUser } = useAuth();
  const location = useLocation();

  // Navigation sections
  const navSections = [
    {
      title: 'Main',
      items: [
        {
          path: '/dashboard',
          icon: 'fa-home',
          label: 'Dashboard'
        },
        {
          path: '/mood/track',
          icon: 'fa-smile',
          label: 'Track Mood'
        },
        {
          path: '/mood/history',
          icon: 'fa-chart-line',
          label: 'Mood History'
        },
        {
          path: '/mood/insights',
          icon: 'fa-brain',
          label: 'Mood Insights'
        }
      ]
    },
    {
      title: 'Connect',
      items: [
        {
          path: '/hug/send',
          icon: 'fa-heart',
          label: 'Send Hug'
        },
        {
          path: '/hug/receive',
          icon: 'fa-hand-holding-heart',
          label: 'Received Hugs'
        },
        {
          path: '/hug/request',
          icon: 'fa-hands-helping',
          label: 'Hug Requests'
        },
        {
          path: '/group-hug',
          icon: 'fa-users',
          label: 'Group Hugs'
        }
      ]
    },
    {
      title: 'Explore',
      items: [
        {
          path: '/community',
          icon: 'fa-globe',
          label: 'Community'
        },
        {
          path: `/profile/${currentUser?.id}`,
          icon: 'fa-user',
          label: 'My Profile'
        },
        {
          path: '/settings',
          icon: 'fa-cog',
          label: 'Settings'
        }
      ]
    }
  ];

  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  // Handle item click on mobile
  const handleItemClick = () => {
    if (isMobile && closeSidebar) {
      closeSidebar();
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      {isMobile && (
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={closeSidebar}>
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <div className="sidebar-user">
        <div className="user-avatar">
          {currentUser?.avatar ? (
            <img src={currentUser.avatar} alt={currentUser.name} />
          ) : (
            <div className="avatar-placeholder">
              {currentUser?.name?.charAt(0) || 'U'}
            </div>
          )}
        </div>
        <div className="user-info">
          <div className="user-name">{currentUser?.name || 'User'}</div>
          <div className="user-status">
            <span className="status-dot online"></span>
            <span className="status-text">Online</span>
          </div>
        </div>
      </div>
      
      <div className="sidebar-content">
        {navSections.map((section, index) => (
          <div key={index} className="sidebar-section">
            <h3 className="section-title">{section.title}</h3>
            <nav className="sidebar-nav">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
                  onClick={handleItemClick}
                >
                  <i className={`nav-icon fas ${item.icon}`}></i>
                  <span className="nav-label">{item.label}</span>
                  {isActive(item.path) && <span className="active-indicator"></span>}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <div className="mood-status">
          <div className="current-mood">
            <span className="mood-label">Current Mood:</span>
            <span className="mood-value">😊 Happy</span>
          </div>
          <div className="mood-streak">
            <i className="fas fa-fire"></i>
            <span>12 Day Streak</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;