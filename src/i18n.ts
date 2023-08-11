import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from './locales/en/en.json';
import uaTranslations from './locales/ua/ua.json';
import ruTranslations from './locales/ru/ru.json';


i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: { translation: enTranslations }, 
      ua: { translation: uaTranslations },
      ru: { translation: ruTranslations }, 
    },
    lng: 'en', 
    fallbackLng: 'en', 
    interpolation: {
      escapeValue: false, 
    },
  });

export default i18n;
