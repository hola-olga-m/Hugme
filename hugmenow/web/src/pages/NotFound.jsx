import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <h1>404</h1>
        <h2>{t('errors.notFound')}</h2>
        <p>{t('app.goBack')}</p>
        <div className="not-found-links">
          <Link to="/" className="btn btn-primary">
            {t('app.name')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;