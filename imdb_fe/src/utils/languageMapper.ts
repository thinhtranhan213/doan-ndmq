import i18n from '../i18n/config';

/**
 * Get current language from i18n
 * @returns language code ('en' or 'vi')
 */
export const getCurrentLanguage = (): string => {
    return i18n.language || 'vi';
};

/**
 * Map application language to TMDB API language code
 * @param appLanguage - Application language code ('en' or 'vi')
 * @returns TMDB language code
 */
export const getTmdbLanguageCode = (appLanguage?: string): string => {
    const lang = appLanguage || getCurrentLanguage();

    const languageMap: { [key: string]: string } = {
        'en': 'en-US',      // English - United States
        'vi': 'vi',         // Vietnamese
    };

    return languageMap[lang] || 'en-US';
};
