import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';

if (typeof window !== 'undefined') {
    localStorage.setItem('i18nextLng', 'en');
}

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
    },
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en'],
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;
