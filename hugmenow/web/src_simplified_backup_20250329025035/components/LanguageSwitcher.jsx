import React from 'react';
import { useTranslation } from 'react-i18next';

/**
 * Language Switcher Component
 * This component provides a dropdown to change the app language
 */
const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  
  // Available languages
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'ru', name: 'Русский' }
  ];
  
  // Current language
  const currentLanguage = i18n.language || 'en';
  
  // Handle language change
  const handleLanguageChange = (e) => {
    const langCode = e.target.value;
    i18n.changeLanguage(langCode);
    
    // Save language preference to localStorage
    localStorage.setItem('preferredLanguage', langCode);
    
    // Optional: Call API to save user preference if authenticated
  };
  
  return (
    <div className="language-switcher">
      <select 
        value={currentLanguage} 
        onChange={handleLanguageChange}
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;