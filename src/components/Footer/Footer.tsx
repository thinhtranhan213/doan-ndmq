
import React from 'react';

const Footer: React.FC = () => {
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
                            <span className="text-white font-semibold">Movie Review</span>
                        </div>
                        <p className="text-gray-400 text-sm">
                            Discover and explore the world of movies. Find ratings, reviews, and details about your favorite films.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <a href="/" className="text-gray-400 hover:text-imdb-yellow transition">
                                    Home
                                </a>
                            </li>
                            <li>
                                <a href="/search" className="text-gray-400 hover:text-imdb-yellow transition">
                                    Search Movies
                                </a>
                            </li>
                            <li>
                                <a href="/" className="text-gray-400 hover:text-imdb-yellow transition">
                                    Popular Movies
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Contact & Info</h3>
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
                            © {currentYear} Movie Review App. All rights reserved.
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
                                Privacy Policy
                            </a>
                            <a href="/" className="text-gray-400 hover:text-imdb-yellow transition text-sm">
                                Terms of Service
                            </a>
                            <a href="/" className="text-gray-400 hover:text-imdb-yellow transition text-sm">
                                Contact Us
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
