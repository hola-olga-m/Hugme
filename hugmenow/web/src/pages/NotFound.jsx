import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

const NotFound = () => {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <h2>{t('error.pageNotFound')}</h2>
        <p>{t('error.pageNotFoundDesc')}</p>
        
        <div className="not-found-actions">
          <Link 
            to={isAuthenticated ? '/' : '/login'} 
            className="btn btn-primary"
          >
            {isAuthenticated ? t('common.returnHome') : t('auth.login')}
          </Link>
          
          {!isAuthenticated && (
            <Link to="/register" className="btn btn-outline">
              {t('auth.register')}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotFound;