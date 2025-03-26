import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Loading screen component with customizable message
 * @param {Object} props - Component props
 * @param {string} props.message - Loading message to display
 * @returns {JSX.Element} - Loading screen component
 */
const LoadingScreen = ({ message = null }) => {
  const { t } = useTranslation();
  const loadingMessage = message || t('app.loading');
  
  return (
    <div className="loading-screen">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        <p className="loading-message">{loadingMessage}</p>
      </div>
    </div>
  );
};

export default LoadingScreen;