
import React, { useEffect } from 'react';
import { useMultipleMovieSections } from '../../hooks/useMultipleMovieSections';
import MovieSection from '../../components/MovieSection/MovieSection';
import VideoHero from '../../components/VideoHero/VideoHero';
import Footer from '../../components/Footer/Footer';

const Home: React.FC = () => {
    const { trending, topRated, popular, loading, error } = useMultipleMovieSections();

    useEffect(() => {
        document.title = 'Movie Review App - Home';
    }, []);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Movies</h2>
                    <p className="text-gray-400">{error}</p>
                </div>
            </div>
        );
    }

    // Lấy movieId từ trending movies để hiển thị video hero
    const heroMovieId = (trending && trending.length > 0) ? trending[0].id : null;

    return (
        <div className="min-h-screen bg-imdb-dark">
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
                        title="🔥 Trending This Week"
                        movies={trending}
                        loading={loading}
                    />
                </div>

                {/* Top Rated Section */}
                <div className="py-12 border-t border-gray-700">
                    <MovieSection
                        title="⭐ Top Rated Movies"
                        movies={topRated}
                        loading={loading}
                    />
                </div>

                {/* Popular Interests Section */}
                <div className="py-12 border-t border-gray-700">
                    <MovieSection
                        title="🎯 Popular Interests"
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
