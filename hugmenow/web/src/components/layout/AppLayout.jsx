import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const AppLayout = ({ children }) => {
  const { t, i18n } = useTranslation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  // Toggle mobile menu
  const toggleMenu = () => {
    setMenuOpen(prev => !prev);
  };

  // Handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  // Handle logout
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="app-layout">
      <header className="app-header">
        <div className="container">
          <div className="nav-container">
            <div className="nav-logo">
              <Link to="/">{t('app.name')}</Link>
            </div>
            
            <button 
              className="mobile-menu-btn"
              onClick={toggleMenu}
              aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
            
            <nav>
              <ul className={`nav-items ${menuOpen ? 'open' : ''}`}>
                <li>
                  <NavLink to="/">{t('nav.dashboard')}</NavLink>
                </li>
                <li>
                  <NavLink to="/mood-tracker">{t('nav.moodTracker')}</NavLink>
                </li>
                <li>
                  <NavLink to="/hug-center">{t('nav.hugCenter')}</NavLink>
                </li>
                <li>
                  <NavLink to="/profile">{t('nav.profile')}</NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} className="nav-logout">
                    {t('auth.logout')}
                  </button>
                </li>
                <li className="nav-language">
                  <button onClick={() => changeLanguage('en')}>EN</button>
                  <button onClick={() => changeLanguage('ru')}>RU</button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        <div className="container">
          {children}
        </div>
      </main>
      
      <footer className="app-footer">
        <div className="container">
          <p>
            &copy; {new Date().getFullYear()} {t('app.name')} - {t('app.footer')}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;