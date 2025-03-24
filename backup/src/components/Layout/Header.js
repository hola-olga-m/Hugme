import React, { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { ThemeContext } from '../../contexts/ThemeContext';
import { HugContext } from '../../contexts/HugContext'; // Added HugContext import

/**
 * Header component with navigation, user info, and notifications
 */
const Header = () => {
  const { user, isAuthenticated, isAnonymous, logout } = useContext(UserContext);
  const { currentTheme, setTheme } = useContext(ThemeContext) || { currentTheme: 'default' };
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const { isConnected } = useContext(HugContext); // Access connection status

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to log out?')) {
      logout();
    }
  };

  // Generate page title based on current route
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/' || path === '/dashboard') return 'Mood Tracker';
    if (path.includes('/mood/history')) return 'Mood History';
    if (path.includes('/mood/following')) return 'Friends\' Moods';
    if (path.includes('/hug/send')) return 'Send a Hug';
    if (path.includes('/hug/request')) return 'Request a Hug';
    if (path.includes('/hug/group')) return 'Group Hug';
    if (path.includes('/hug/media')) return 'Media Hugs';
    if (path.includes('/profile')) return 'My Profile';
    if (path.includes('/settings')) return 'Settings';
    if (path.includes('/therapy')) return 'Therapy Dashboard';
    if (path.includes('/premium')) return 'Premium Plans';
    return 'HugMood';
  };

  return (
    <header className="app-header">
      <div className="header-left">
        <div className="menu-toggle" onClick={toggleMenu}>
          <div className={`menu-icon ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
        <h1 className="page-title">{getPageTitle()}</h1>
      </div>

      <div className="header-right">
        <div className={`connection-dot ${isConnected ? 'connected' : 'disconnected'}`} title={isConnected ? 'Connected' : 'Disconnected'}> </div> {/* Added connection indicator */}
        
        {isAuthenticated ? (
          <div className="header-action-buttons">
            <Link to="/dashboard" className="header-action" title="Track Mood">
              <span className="icon">📊</span>
            </Link>
            <Link to="/hug/send" className="header-action" title="Send Hug">
              <span className="icon">🤗</span>
            </Link>
            <Link to="/mood/insights" className="header-action" title="Mood Insights">
              <span className="icon">📈</span>
            </Link>
          </div>
        ) : (
          <div className="auth-buttons">
            <Link to="/login" className="auth-button login-button">
              <span>Login</span>
            </Link>
            <Link to="/register" className="auth-button register-button">
              <span>Sign Up</span>
            </Link>
          </div>
        )}
        
        <Link to="/user-guide" className="help-icon" title="User Guide">
          <span className="icon">❓</span>
        </Link>

        {isAuthenticated && (
          <>
            <Link to="/notifications" className="notification-icon">
              <span className="icon">🔔</span>
              {/* Show notification badge if there are unread notifications */}
              <span className="notification-badge">3</span>
            </Link>

            <div className="user-menu">
              <div className="user-avatar" onClick={() => setMenuOpen(!menuOpen)}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.username} />
                ) : (
                  <div className="avatar-placeholder">
                    {user?.username?.charAt(0)?.toUpperCase() || '?'}
                  </div>
                )}
                {isAnonymous && <span className="anonymous-badge">Anonymous</span>}
              </div>

              {menuOpen && (
                <div className="dropdown-menu">
                  <div className="user-info">
                    <strong>{user?.username || 'User'}</strong>
                    {!isAnonymous && <span>{user?.email || ''}</span>}
                  </div>

                  <ul>
                    <li>
                      <Link to="/profile" onClick={() => setMenuOpen(false)}>
                        My Profile
                      </Link>
                    </li>
                    <li>
                      <Link to="/settings/theme" onClick={() => setMenuOpen(false)}>
                        Theme Settings
                      </Link>
                    </li>
                    <li>
                      <Link to="/user-guide" onClick={() => setMenuOpen(false)}>
                        Help & User Guide
                      </Link>
                    </li>
                    {isAnonymous ? (
                      <li>
                        <Link to="/login" onClick={() => setMenuOpen(false)}>
                          Sign In
                        </Link>
                      </li>
                    ) : (
                      <li>
                        <button onClick={handleLogout}>
                          Log Out
                        </button>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;