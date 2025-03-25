import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';

const Profile = () => {
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
    <div className="profile-page">
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
          <h2>{t('profile.myProfile')}</h2>
          <div className="page-actions">
            <Link to="/dashboard" className="btn btn-outline">
              {t('app.goBack')}
            </Link>
          </div>
        </div>
        
        <div className="profile-info">
          <div className="profile-avatar">
            {currentUser?.avatarUrl ? (
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.name || currentUser.username}
                className="avatar-image"
              />
            ) : (
              <div className="avatar-placeholder">
                {(currentUser?.name?.charAt(0) || currentUser?.username?.charAt(0) || '?').toUpperCase()}
              </div>
            )}
          </div>
          
          <div className="profile-details">
            <h3>{currentUser?.name || currentUser?.username}</h3>
            <p>{currentUser?.email}</p>
            <p>{currentUser?.isAnonymous ? t('auth.anonymousWelcome') : ''}</p>
            
            <div className="profile-meta">
              <p>
                <strong>{t('auth.username')}:</strong> {currentUser?.username}
              </p>
              <p>
                <strong>{t('auth.email')}:</strong> {currentUser?.email}
              </p>
              <p>
                <strong>{t('auth.name')}:</strong> {currentUser?.name}
              </p>
            </div>
          </div>
        </div>
        
        <div className="profile-actions">
          <p>{t('profile.editProfile')} - {t('app.comingSoon')}</p>
        </div>
      </div>
      
      <div className="app-footer">
        <p>&copy; 2025 {t('app.name')}</p>
      </div>
    </div>
  );
};

export default Profile;