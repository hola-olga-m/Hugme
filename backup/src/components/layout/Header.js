import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

const Header = ({ toggleSidebar, isMobile }) => {
  const { currentUser, isAuthenticated, logout } = useAuth();
  const { theme, themePreference, setTheme } = useTheme();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const toggleTheme = () => {
    const newTheme = themePreference === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  return (
    <header className="app-header">
      <div className="container header-container">
        <div className="header-left">
          {isMobile && isAuthenticated && (
            <button 
              className="sidebar-toggle" 
              onClick={toggleSidebar}
              aria-label="Toggle Sidebar"
            >
              <i className="fas fa-bars"></i>
            </button>
          )}
          
          <Link to="/" className="logo">
            <div className="logo-icon">
              <i className="fas fa-heart-circle"></i>
            </div>
            <div className="logo-text">HugMood</div>
          </Link>
          
          {!isMobile && isAuthenticated && (
            <nav className="header-nav">
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/mood/track" className="nav-link">Track Mood</Link>
              <Link to="/hug/send" className="nav-link">Send Hug</Link>
              <Link to="/community" className="nav-link">Community</Link>
            </nav>
          )}
        </div>
        
        <div className="header-right">
          <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${themePreference === 'light' ? 'dark' : 'light'} mode`}
          >
            {themePreference === 'light' ? (
              <i className="fas fa-moon"></i>
            ) : (
              <i className="fas fa-sun"></i>
            )}
          </button>
          
          {isAuthenticated ? (
            <div className="user-menu" ref={dropdownRef}>
              <button 
                className="user-menu-button" 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-expanded={dropdownOpen}
              >
                <div className="user-avatar">
                  {currentUser?.avatar ? (
                    <img src={currentUser.avatar} alt={currentUser.name} />
                  ) : (
                    <div className="avatar-placeholder">
                      {currentUser?.name?.charAt(0) || 'U'}
                    </div>
                  )}
                </div>
                {!isMobile && (
                  <>
                    <span className="user-name">{currentUser?.name || 'User'}</span>
                    <i className={`fas fa-chevron-${dropdownOpen ? 'up' : 'down'}`}></i>
                  </>
                )}
              </button>
              
              {dropdownOpen && (
                <div className="user-dropdown">
                  <div className="dropdown-user-info">
                    <div className="dropdown-avatar">
                      {currentUser?.avatar ? (
                        <img src={currentUser.avatar} alt={currentUser.name} />
                      ) : (
                        <div className="avatar-placeholder large">
                          {currentUser?.name?.charAt(0) || 'U'}
                        </div>
                      )}
                    </div>
                    <div className="dropdown-user-details">
                      <div className="dropdown-user-name">{currentUser?.name || 'User'}</div>
                      <div className="dropdown-user-email">{currentUser?.email || 'Anonymous'}</div>
                    </div>
                  </div>
                  
                  <div className="dropdown-divider"></div>
                  
                  <Link to={`/profile/${currentUser?.id}`} className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-user"></i> Profile
                  </Link>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-cog"></i> Settings
                  </Link>
                  <Link to="/mood/history" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    <i className="fas fa-chart-line"></i> Mood History
                  </Link>
                  
                  <div className="dropdown-divider"></div>
                  
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="fas fa-sign-out-alt"></i> Log Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/auth/login" className="login-btn">Log In</Link>
              <Link to="/auth/register" className="signup-btn">Sign Up</Link>
            </div>
          )}
          
          {isMobile && !isAuthenticated && (
            <button 
              className="mobile-menu-toggle" 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
            >
              <i className={`fas fa-${mobileMenuOpen ? 'times' : 'bars'}`}></i>
            </button>
          )}
        </div>
      </div>
      
      {isMobile && mobileMenuOpen && !isAuthenticated && (
        <div className="mobile-menu">
          <div className="mobile-menu-container">
            <Link to="/" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>Home</Link>
            <Link to="/features" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>Features</Link>
            <Link to="/about" className="mobile-menu-item" onClick={() => setMobileMenuOpen(false)}>About</Link>
            <div className="mobile-auth">
              <Link to="/auth/login" className="mobile-login-btn" onClick={() => setMobileMenuOpen(false)}>Log In</Link>
              <Link to="/auth/register" className="mobile-signup-btn" onClick={() => setMobileMenuOpen(false)}>Sign Up</Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;