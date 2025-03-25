import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="language-switcher">
      <button 
        className={`language-btn ${i18n.language === 'en' ? 'active' : ''}`}
        onClick={() => changeLanguage('en')}
      >
        {t('common.english')}
      </button>
      <button 
        className={`language-btn ${i18n.language === 'ru' ? 'active' : ''}`}
        onClick={() => changeLanguage('ru')}
      >
        {t('common.russian')}
      </button>
    </div>
  );
};

export default LanguageSwitcher;