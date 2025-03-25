import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Dashboard = () => {
  const { t } = useTranslation();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    try {
      await logout();
      // Redirect will be handled by protected route
    } catch (err) {
      console.error('Logout error:', err);
    }
  };
  
  return (
    <div className="dashboard">
      <div className="app-header">
        <h1>{t('app.name')}</h1>
        
        <div className="header-actions">
          <LanguageSwitcher />
          <button onClick={handleLogout} className="btn btn-outline">
            {t('auth.logout')}
          </button>
        </div>
      </div>
      
      <div className="app-content">
        <div className="dashboard-header">
          <div className="user-welcome">
            <h2>{t('dashboard.welcome', { name: currentUser?.name || currentUser?.username })}</h2>
          </div>
        </div>
        
        <div className="dashboard-content">
          {/* Mood tracking card */}
          <div className="dashboard-card">
            <h3>{t('dashboard.yourMoods')}</h3>
            <p>{t('mood.track')}</p>
            <a href="/mood-tracker" className="btn btn-primary">
              {t('dashboard.trackMood')}
            </a>
          </div>
          
          {/* Hugs card */}
          <div className="dashboard-card">
            <h3>{t('dashboard.yourHugs')}</h3>
            <p>{t('hugs.send')}</p>
            <a href="/hug-center" className="btn btn-primary">
              {t('dashboard.newHug')}
            </a>
          </div>
          
          {/* Profile card */}
          <div className="dashboard-card">
            <h3>{t('profile.myProfile')}</h3>
            <p>{t('profile.editProfile')}</p>
            <a href="/profile" className="btn btn-primary">
              {t('profile.editProfile')}
            </a>
          </div>
        </div>
      </div>
      
      <div className="app-footer">
        <p>&copy; 2025 {t('app.name')}</p>
      </div>
    </div>
  );
};

export default Dashboard;