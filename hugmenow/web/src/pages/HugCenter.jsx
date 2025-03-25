import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const HugCenter = () => {
  const { t } = useTranslation();
  const { logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by protected route
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  return (
    <div className="hug-center-page">
      <div className="app-header">
        <h1>
          <Link to="/dashboard">{t('app.name')}</Link>
        </h1>
        
        <div className="header-actions">
          <LanguageSwitcher />
          <button onClick={handleLogout} className="btn btn-outline">
            {t('auth.logout')}
          </button>
        </div>
      </div>
      
      <div className="app-content">
        <div className="page-header">
          <h2>{t('hugs.send')}</h2>
          <div className="page-actions">
            <Link to="/dashboard" className="btn btn-outline">
              {t('app.goBack')}
            </Link>
          </div>
        </div>
        
        <div className="placeholder-message">
          <p>{t('hugs.send')} - {t('app.loading')}</p>
          <p>{t('app.comingSoon')}</p>
        </div>
      </div>
      
      <div className="app-footer">
        <p>&copy; 2025 {t('app.name')}</p>
      </div>
    </div>
  );
};

export default HugCenter;