import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslations from './locales/en.json';
import uaTranslations from './locales/ua.json';
import ruTranslations from './locales/ru.json';

i18n.use(LanguageDetector).init({
  resources: {
    en: { translation: enTranslations },
    ua: { translation: uaTranslations },
    ru: { translation: ruTranslations },
  },
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;