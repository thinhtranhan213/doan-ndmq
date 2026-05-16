
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useMultipleMovieSections } from '../../hooks/useMultipleMovieSections';
import MovieSection from '../../components/MovieSection/MovieSection';
import VideoHero from '../../components/VideoHero/VideoHero';
import Footer from '../../components/Footer/Footer';

const Home: React.FC = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const { trending, topRated, popular, loading, error } = useMultipleMovieSections();
    const [showSignUpToast, setShowSignUpToast] = useState(false);

    useEffect(() => {
        document.title = 'Movie Review App - Home';
    }, []);

    useEffect(() => {
        if (location.state?.signedUp) {
            setShowSignUpToast(true);
            window.history.replaceState({}, '');
            const timer = setTimeout(() => setShowSignUpToast(false), 3000);
            return () => clearTimeout(timer);
        }
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">{t('movies.errorLoading')}</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    // Lấy movieId từ trending movies để hiển thị video hero
    const heroMovieId = (trending && trending.length > 0) ? trending[0].id : null;

    return (
        <div className="min-h-screen bg-imdb-dark">
            {showSignUpToast && (
                <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3 bg-green-600 text-white text-sm font-medium rounded-lg shadow-lg animate-fade-in">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    Đăng ký thành công! Chào mừng bạn đến với IMDb.
                </div>
            )}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
                {/* Video Hero Section - Chỉ hiển thị khi đã load xong trending movies */}
                {heroMovieId && !loading && (
                    <div className="mb-8 mt-24">
                        <VideoHero movieId={heroMovieId} />
                    </div>
                )}

                {/* Trending Section */}
                <div className="py-12">
                    <MovieSection
                        title={`🔥 ${t('movies.trendingThisWeek')}`}
                        movies={trending}
                        loading={loading}
                    />
                </div>

                {/* Top Rated Section */}
                <div className="py-12 border-t border-gray-700">
                    <MovieSection
                        title={`⭐ ${t('movies.topRatedMovies')}`}
                        movies={topRated}
                        loading={loading}
                    />
                </div>

                {/* Popular Interests Section */}
                <div className="py-12 border-t border-gray-700">
                    <MovieSection
                        title={`🎯 ${t('movies.popularInterests')}`}
                        movies={popular}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Home;
