import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../components/LanguageSwitcher';

function MainLayout({ children }) {
  const { t } = useTranslation();
  const { currentUser, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu when location changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDropdownOpen(false);
  }, [location]);

  // Handle menu toggle
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Handle dropdown toggle
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Get shortened name for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    
    const nameParts = name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-content">
          <div className="header-left">
            <Link to="/" className="logo">
              <span className="logo-icon">🤗</span>
              <span className="logo-text">HugMeNow</span>
            </Link>
          </div>
          
          {isAuthenticated() && (
            <nav className={`main-nav ${isMenuOpen ? 'open' : ''}`}>
              <ul className="nav-list">
                <li className="nav-item">
                  <Link 
                    to="/dashboard" 
                    className={location.pathname === '/dashboard' ? 'active' : ''}
                  >
                    {t('navigation.dashboard')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/mood-tracker" 
                    className={location.pathname === '/mood-tracker' ? 'active' : ''}
                  >
                    {t('navigation.moodTracker')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/hug-center" 
                    className={location.pathname === '/hug-center' ? 'active' : ''}
                  >
                    {t('navigation.hugCenter')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/hug-gallery" 
                    className={location.pathname === '/hug-gallery' ? 'active' : ''}
                  >
                    {t('nav.hugGallery')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/mood-history" 
                    className={location.pathname === '/mood-history' ? 'active' : ''}
                  >
                    {t('moodTracker.moodHistory')}
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    to="/mesh-sdk-demo" 
                    className={location.pathname === '/mesh-sdk-demo' ? 'active' : ''}
                  >
                    Mesh SDK Demo
                  </Link>
                </li>
              </ul>
            </nav>
          )}
          
          <div className="header-right">
            {isAuthenticated() ? (
              <div className="user-menu">
                <button 
                  className="user-avatar"
                  onClick={toggleDropdown}
                  aria-label="User menu"
                >
                  {currentUser?.avatarUrl ? (
                    <img src={currentUser.avatarUrl} alt={currentUser.name || currentUser.username} />
                  ) : (
                    <div className="avatar-initials">
                      {getInitials(currentUser?.name || currentUser?.username)}
                    </div>
                  )}
                </button>
                
                {isDropdownOpen && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <p className="user-name">{currentUser?.name || currentUser?.username}</p>
                      <p className="user-email">{currentUser?.email}</p>
                    </div>
                    <ul className="dropdown-list">
                      <li className="dropdown-item">
                        <Link to="/profile">{t('navigation.profile')}</Link>
                      </li>
                      <li className="dropdown-item">
                        <button onClick={handleLogout}>{t('navigation.logout')}</button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className="auth-buttons">
                <Link to="/login" className="btn btn-outline">{t('navigation.login')}</Link>
                <Link to="/register" className="btn btn-primary">{t('auth.signUp')}</Link>
              </div>
            )}
            
            <LanguageSwitcher />
            
            <button 
              className={`menu-toggle ${isMenuOpen ? 'open' : ''}`}
              onClick={toggleMenu}
              aria-label="Mobile menu"
            >
              <span className="menu-toggle-bar"></span>
              <span className="menu-toggle-bar"></span>
              <span className="menu-toggle-bar"></span>
            </button>
          </div>
        </div>
      </header>
      
      <main className="app-main">
        {children}
      </main>
      
      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-left">
            <div className="footer-logo">
              <span className="logo-icon">🤗</span>
              <span className="logo-text">HugMeNow</span>
            </div>
            <p className="footer-tagline">
              Supporting emotional wellness with virtual hugs and mood tracking
            </p>
          </div>
          <div className="footer-right">
            <div className="footer-links">
              <div className="footer-links-column">
                <h4>Platform</h4>
                <ul>
                  <li><Link to="/">{t('navigation.home')}</Link></li>
                  <li><Link to="/dashboard">{t('navigation.dashboard')}</Link></li>
                  <li><Link to="/mood-tracker">{t('navigation.moodTracker')}</Link></li>
                  <li><Link to="/hug-center">{t('navigation.hugCenter')}</Link></li>
                  <li><Link to="/hug-gallery">{t('nav.hugGallery')}</Link></li>
                  <li><Link to="/mesh-sdk-demo">Mesh SDK Demo</Link></li>
                </ul>
              </div>
              <div className="footer-links-column">
                <h4>Resources</h4>
                <ul>
                  <li><a href="#">Help Center</a></li>
                  <li><a href="#">Privacy Policy</a></li>
                  <li><a href="#">Terms of Service</a></li>
                  <li><a href="#">Contact Us</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} HugMeNow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;