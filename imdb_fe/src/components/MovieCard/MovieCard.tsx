
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Movie } from '../../types/movie.types';
import { getImageUrl, IMAGE_SIZES } from '../../utils/constants';
import { useAuthStore } from '../../store/authStore';
import { useWatchlistStore } from '../../store/watchlistStore';

interface MovieCardProps {
    movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const imageUrl = getImageUrl(movie.poster_path, IMAGE_SIZES.POSTER_MEDIUM);
    const { isAuthenticated } = useAuthStore();
    const { toggleMovieInWatchlist, loading, watchlistMovieIds } = useWatchlistStore();
    const [isInList, setIsInList] = useState(false);
    const [isHovering, setIsHovering] = useState(false);

    // Subscribe to watchlist changes
    useEffect(() => {
        setIsInList(watchlistMovieIds.has(movie.id));
    }, [movie.id, watchlistMovieIds]);

    const handleWatchlistClick = useCallback(async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        try {
            await toggleMovieInWatchlist(movie.id);
        } catch (error) {
            console.error('Error toggling watchlist:', error);
        }
    }, [movie.id, isAuthenticated, navigate, toggleMovieInWatchlist]);

    return (
        <div
            onClick={() => navigate(`/movie/${movie.id}`)}
            className="group cursor-pointer w-full max-w-[250px]"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            {/* Background Image Container */}
            <div
                className="overflow-hidden rounded-lg shadow-lg aspect-[2/3] bg-gray-900 bg-cover bg-center relative transition-transform duration-300 hover:scale-105 min-h-[375px]"
                style={{ backgroundImage: `url(${imageUrl})` }}
            >
                {/* Dark Gradient Overlay - Chỉ hiển thị khi hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none z-10"></div>

                {/* Watchlist Button - Hiển thị khi user đăng nhập và hover */}
                {isAuthenticated && isHovering && (
                    <button
                        onClick={handleWatchlistClick}
                        disabled={loading}
                        className={`absolute top-2 right-2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isInList
                            ? 'bg-red-500 text-white hover:bg-red-600'
                            : 'bg-gray-700/80 text-white hover:bg-gray-600'
                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                        title={isInList ? t('movies.removeFromWatchlist') : t('movies.addToWatchlist')}
                    >
                        {loading ? (
                            <span className="animate-spin">⌛</span>
                        ) : (
                            <span className="text-lg">{isInList ? '❤️' : '🤍'}</span>
                        )}
                    </button>
                )}

                {/* Movie Info - Đè lên ảnh, chỉ hiển thị khi hover */}
                <div className="absolute bottom-0 left-0 right-0 p-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <h3 className="text-white font-semibold text-base line-clamp-2 mb-2 drop-shadow-lg">
                        {movie.title}
                    </h3>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-gray-300 text-sm drop-shadow-lg">
                            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                        </p>
                        <div className="bg-imdb-yellow text-white px-2 py-1 rounded font-bold text-sm">
                            ⭐ {movie.vote_average.toFixed(1)}
                        </div>
                    </div>
                    {/* Overview */}
                    <p className="text-gray-200 text-sm line-clamp-3 drop-shadow-lg">{movie.overview}</p>
                </div>
            </div>
        </div>
    );
};

export default MovieCard;
