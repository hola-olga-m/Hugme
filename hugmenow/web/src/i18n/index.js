import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import en from './locales/en';
import ru from './locales/ru';

// Configure i18next
i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass the i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    debug: process.env.NODE_ENV === 'development',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    resources: {
      en: {
        translation: en
      },
      ru: {
        translation: ru
      }
    },
    detection: {
      // Order of language detection
      order: [
        'localStorage', 
        'navigator', 
        'htmlTag', 
        'path', 
        'subdomain'
      ],
      // Keys to lookup language from
      lookupLocalStorage: 'preferredLanguage',
      // Cache user language on
      caches: ['localStorage'],
      // Optional expire
      cookieExpirationDate: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 years
    }
  });

export default i18n;