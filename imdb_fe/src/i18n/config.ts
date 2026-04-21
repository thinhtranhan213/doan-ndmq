import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import viTranslation from './locales/vi.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    vi: {
        translation: viTranslation,
    },
};

// Get initial language from localStorage or browser language
const getInitialLanguage = () => {
    const savedLang = localStorage.getItem('language');
    if (savedLang) {
        return savedLang;
    }

    const browserLang = navigator.language.split('-')[0];
    return ['en', 'vi'].includes(browserLang) ? browserLang : 'en';
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: getInitialLanguage(),
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false,
        },
    });

export default i18n;
