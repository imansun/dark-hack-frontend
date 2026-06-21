import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fa from './locales/fa/common.json';
import en from './locales/en/common.json';
import ar from './locales/ar/common.json';

const savedLang = localStorage.getItem('lang') || 'fa';

i18n.use(initReactI18next).init({
  resources: {
    fa: { translation: fa },
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: savedLang,
  fallbackLng: 'fa',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
