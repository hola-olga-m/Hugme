import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';

/**
 * AppLayout component that wraps all app pages with common layout elements
 * including header, navigation, and footer.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render inside the layout
 * @returns {JSX.Element} - AppLayout component
 */
const AppLayout = ({ children }) => {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // State for mobile navigation
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  
  // Toggle mobile navigation
  const toggleMobileNav = () => {
    setMobileNavOpen(prev => !prev);
  };
  
  // Close mobile navigation
  const closeMobileNav = () => {
    setMobileNavOpen(false);
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      closeMobileNav();
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  // Check if the current route matches the given path
  const isActivePath = (path) => {
    return location.pathname === path;
  };
  
  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="header-container">
          <div className="logo">
            <Link to="/" onClick={closeMobileNav}>
              <h1>{t('app.name')}</h1>
            </Link>
          </div>
          
          <button 
            className="mobile-nav-toggle" 
            aria-expanded={mobileNavOpen}
            onClick={toggleMobileNav}
          >
            <span className="sr-only">
              {mobileNavOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            </span>
            <div className={`hamburger ${mobileNavOpen ? 'open' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </button>
          
          <nav className={`main-nav ${mobileNavOpen ? 'open' : ''}`}>
            <ul className="nav-list">
              <li className="nav-item">
                <Link 
                  to="/" 
                  className={isActivePath('/') ? 'active' : ''}
                  onClick={closeMobileNav}
                >
                  {t('nav.dashboard')}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/mood-tracker" 
                  className={isActivePath('/mood-tracker') ? 'active' : ''}
                  onClick={closeMobileNav}
                >
                  {t('nav.moodTracker')}
                </Link>
              </li>
              <li className="nav-item">
                <Link 
                  to="/hug-center" 
                  className={isActivePath('/hug-center') ? 'active' : ''}
                  onClick={closeMobileNav}
                >
                  {t('nav.hugCenter')}
                </Link>
              </li>
              
              {user ? (
                <>
                  <li className="nav-item user-menu">
                    <Link 
                      to="/profile" 
                      className={`user-link ${isActivePath('/profile') ? 'active' : ''}`}
                      onClick={closeMobileNav}
                    >
                      {user.avatarUrl ? (
                        <img 
                          src={user.avatarUrl} 
                          alt={user.name || user.username} 
                          className="user-avatar"
                        />
                      ) : (
                        <div className="avatar-placeholder">
                          {(user.name || user.username || '?').charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="user-name">{user.name || user.username}</span>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="logout-button"
                      onClick={handleLogout}
                    >
                      {t('auth.logout')}
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link 
                      to="/login" 
                      className={`login-button ${isActivePath('/login') ? 'active' : ''}`}
                      onClick={closeMobileNav}
                    >
                      {t('auth.login')}
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link 
                      to="/register" 
                      className={`register-button ${isActivePath('/register') ? 'active' : ''}`}
                      onClick={closeMobileNav}
                    >
                      {t('auth.register')}
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      
      <main className="app-main">
        {children}
      </main>
      
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-content">
            <p className="copyright">
              &copy; {new Date().getFullYear()} {t('app.name')}. {t('app.footer')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;