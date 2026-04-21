
import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer: React.FC = () => {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-slate-900 border-t border-slate-700 mt-16 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* About Section */}
                    <div>
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-imdb-yellow text-white font-bold px-2 py-1 rounded">
                                IMDb
                            </div>
                            <span className="text-white font-semibold">{t('common.movieReview')}</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            {t('common.discoverExplore')}
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('common.quickLinks')}</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-400 hover:text-imdb-yellow transition">
                                    {t('common.home')}
                                </a>
                            </li>
                            <li>
                                <a href="/search" className="text-gray-400 hover:text-imdb-yellow transition">
                                    {t('movies.searchMovies')}
                                </a>
                            </li>
                            <li>
                                <a href="/" className="text-gray-400 hover:text-imdb-yellow transition">
                                    {t('movies.popualrMovies') || 'Popular Movies'}
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">{t('common.contact')} & {t('common.aboutUs')}</h3>
                        <p className="text-gray-400 text-sm mb-2">
                            Powered by{' '}
                            <a
                                href="https://www.themoviedb.org/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-imdb-yellow hover:underline"
                            >
                                The Movie Database (TMDb)
                            </a>
                        </p>
                        <p className="text-gray-400 text-sm">
                            © {currentYear} Movie Review App. {t('common.copyright')}
                        </p>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-slate-700 pt-8">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <p className="text-gray-400 text-sm text-center md:text-left">
                            Built with React & TypeScript
                        </p>
                        <div className="flex space-x-6 mt-4 md:mt-0">
                            <a href="/" className="text-gray-400 hover:text-imdb-yellow transition text-sm">
                                {t('common.privacyPolicy')}
                            </a>
                            <a href="/" className="text-gray-400 hover:text-imdb-yellow transition text-sm">
                                Terms of Service
                            </a>
                            <a href="/" className="text-gray-400 hover:text-imdb-yellow transition text-sm">
                                {t('common.contact')} Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
