import React from 'react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher: React.FC = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = (lang: string) => {
        i18n.changeLanguage(lang);
        localStorage.setItem('language', lang);
    };

    return (
        <div className="flex gap-2 items-center">
            <button
                onClick={() => handleLanguageChange('en')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${i18n.language === 'en'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                EN
            </button>
            <button
                onClick={() => handleLanguageChange('vi')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${i18n.language === 'vi'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
            >
                VI
            </button>
        </div>
    );
};

export default LanguageSwitcher;
