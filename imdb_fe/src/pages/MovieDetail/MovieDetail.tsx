import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useMovieDetail } from '../../hooks/useMovieDetail';
import { useBlacklistStore } from '../../store/blacklistStore';
import { usePlaylistStore } from '../../store/playlistStore';
import { useAuthStore } from '../../store/authStore';
import MovieCard from '../../components/MovieCard/MovieCard';
import { getImageUrl, IMAGE_SIZES, formatDate, formatRuntime, formatCurrency } from '../../utils/constants';
import PlaylistModal from './PlaylistModal';
import TrailerModal from './TrailerModal';
import ReviewSection from '../../components/Review/ReviewSection';


const MovieDetail: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const isBlacklisted = useBlacklistStore((s) => s.isBlacklisted);
    const { movie, credits, similarMovies, recommendations, loading, error } = useMovieDetail(Number(id));
    const { isAuthenticated } = useAuthStore();
    const { toggleMovieInPlaylist } = usePlaylistStore();
    const [showAllCast, setShowAllCast] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [showTrailer, setShowTrailer] = useState(false);

    // Add movie to Recently Viewed when component loads and movie is available
    useEffect(() => {
        if (movie && isAuthenticated) {
            console.log(`Adding movie ${movie.id} to Recently Viewed`);
            toggleMovieInPlaylist('recentlyViewed', movie.id).catch(err => {
                console.error('Failed to add to Recently Viewed:', err);
            });
        }
    }, [movie?.id, isAuthenticated, toggleMovieInPlaylist]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-imdb-yellow"></div>
            </div>
        );
    }

    if (error || !movie || isBlacklisted(Number(id))) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-500 text-white p-4 rounded-lg">
                    {error || t('movies.movieNotFound')}
                </div>
            </div>
        );
    }

    // Lấy director từ credits
    const director = credits?.crew.find((c) => c.job === 'Director');
    const writers = credits?.crew.filter((c) => c.job === 'Writer').slice(0, 3);

    return (
        <>
            <div className="min-h-screen bg-imdb-dark">
                {/* Backdrop Banner */}
                <div
                    className="relative h-[500px] bg-cover bg-center"
                    style={{
                        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(18,18,18,1)), url(${getImageUrl(
                            movie.backdrop_path,
                            IMAGE_SIZES.BACKDROP_LARGE
                        )})`,
                    }}
                >
                </div>

                {/* Movie Details */}
                <div className="container mx-auto px-4 -mt-32 relative z-10 pb-12">
                    <div className="flex flex-col md:flex-row gap-8 mb-12">
                        {/* Poster */}
                        <div className="flex-shrink-0">
                            <img
                                src={getImageUrl(movie.poster_path, IMAGE_SIZES.POSTER_LARGE)}
                                alt={movie.title}
                                className="w-full md:w-80 rounded-lg shadow-2xl"
                            />
                        </div>


                        {/* Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold text-white mb-2">{movie.title}</h1>
                            <p className="text-gray-400 italic mb-4">{movie.tagline}</p>

                            {/* Rating */}
                            <div className="flex items-center gap-4 mb-4 flex-wrap">
                                <div className="flex items-center bg-imdb-yellow text-white px-3 py-1 rounded font-bold">
                                    ⭐ {movie.vote_average.toFixed(1)}/10
                                </div>
                                <span className="text-gray-400">{formatDate(movie.release_date)}</span>
                                <span className="text-gray-400">{formatRuntime(movie.runtime)}</span>
                            </div>

                            {/* Genres */}
                            <div className="flex flex-wrap gap-2 mb-6">
                                {movie.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="bg-imdb-gray text-white px-3 py-1 rounded-full text-sm border border-white cursor-pointer hover:bg-white hover:text-black transition"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>

                            {/* Action bar */}
                            <div className="flex gap-3 mb-6 flex-wrap">
                                {/* Add to playlist */}
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-gray-700 cursor-pointer px-4 py-2 rounded text-white hover:bg-gray-600"
                                >
                                    ➕ Thêm vào danh sách
                                </button>

                                {/* Favorite */}
                                {/* Sau này sẽ  thêm danh sách muốn xem Table Watched -> Thêm api moviedetail và xử lý  */}
                                <button
                                    className="bg-gray-700 cursor-pointer px-4 py-2 rounded text-white hover:bg-gray-600"
                                >
                                    ❤️ Yêu thích
                                </button>

                                {/* Trailer */}
                                <button
                                    onClick={() => setShowTrailer(true)}
                                    className="bg-imdb-yellow text-grey cursor-pointer px-4 py-2 rounded font-semibold hover:bg-yellow-400"
                                >
                                    ▶ Xem trailer
                                </button>
                            </div>

                            {/* Overview */}
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-white mb-2">{t('movies.synopsis')}</h2>
                                <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                            </div>

                            {/* Director & Writers */}
                            {(director || writers) && (
                                <div className="mb-6 bg-slate-800 p-4 rounded-lg">
                                    {director && (
                                        <div className="mb-3">
                                            <p className="text-gray-400 text-sm">{t('movies.director')}</p>

                                            <p className="text-white cursor-pointer font-semibold hover:underline">
                                                {director.name}
                                            </p>
                                        </div>
                                    )}
                                    {writers && writers.length > 0 && (
                                        <div>
                                            <p className="text-gray-400 text-sm">{t('movies.writers')}</p>
                                            <p className="text-white font-semibold cursor-pointer hover:underline">{writers.map((w) => w.name).join(', ')}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Additional Info */}
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-imdb-gray p-4 rounded-lg mb-6">
                                <div>
                                    <p className="text-gray-400 text-sm">{t('movies.status')}</p>
                                    <p className="text-white font-semibold">{movie.status}</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">{t('movies.budget')}</p>
                                    <p className="text-white font-semibold">
                                        {movie.budget ? formatCurrency(movie.budget) : 'N/A'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm">{t('movies.revenue')}</p>
                                    <p className="text-white font-semibold">
                                        {movie.revenue ? formatCurrency(movie.revenue) : 'N/A'}
                                    </p>
                                </div>
                                {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm">{t('movies.languages')}</p>
                                        <p className="text-white font-semibold text-sm">
                                            {movie.spoken_languages.map((lang) => lang.name).join(', ')}
                                        </p>
                                    </div>
                                )}
                                {movie.production_companies && movie.production_companies.length > 0 && (
                                    <div className="md:col-span-2">
                                        <p className="text-gray-400 text-sm">{t('movies.production')}</p>
                                        <p className="text-white font-semibold text-sm">
                                            {movie.production_companies.map((company, index) => (
                                                <span key={company.id}>
                                                    <span className="cursor-pointer hover:underline">
                                                        {company.name}
                                                    </span>
                                                    {index < movie.production_companies.length - 1 && ', '}
                                                </span>
                                            ))}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* LOWER CONTENT – CENTERED */}
                    <div className="flex justify-center">
                        <div className="w-full max-w-6xl">
                            {/* Cast Section */}
                            {credits && credits.cast.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-white mb-6">👥 {t('movies.topCast')}</h2>

                                    {/* Cast list */}
                                    <div
                                        className={`
                                grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6
                                transition-all duration-300
                                ${showAllCast ? '' : 'max-h-[160px] overflow-hidden'}
                            `}
                                    >
                                        {credits.cast.slice(0, 18).map((member) => (
                                            <div key={member.id} className="flex items-center gap-4">
                                                <img
                                                    src={getImageUrl(member.profile_path, IMAGE_SIZES.PROFILE_MEDIUM)}
                                                    alt={member.name}
                                                    className="w-16 h-16 rounded-full object-cover bg-imdb-gray"
                                                />

                                                <div>
                                                    <p className="text-white font-semibold leading-tight cursor-pointer hover:underline">
                                                        {member.name}
                                                    </p>
                                                    <p className="text-gray-400 text-sm leading-tight">
                                                        {member.character}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Expand button */}
                                    {credits.cast.length > 6 && (
                                        <div className="mt-4 text-center">
                                            <button
                                                onClick={() => setShowAllCast(!showAllCast)}
                                                className="
                                        text-sm font-semibold
                                        cursor-pointer
                                        text-gray-400
                                        bg-gradient-to-b from-gray-400/40 to-gray-400/80
                                        bg-clip-text text-transparent
                                        transition-all duration-300
                                        hover:from-gray-200 hover:to-gray-200
                                        hover:text-gray-200
                                    "
                                            >
                                                {showAllCast ? `${t('common.showLess')} ▲` : `${t('movies.showAllCast')} ▼`}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Review & Comment System */}
                            <ReviewSection filmId={Number(id)} />


                            {/* Similar Movies */}
                            {similarMovies && similarMovies.length > 0 && (
                                <div className="mb-12">
                                    <h2 className="text-3xl font-bold text-white mb-6">🎬 {t('movies.similarMovies')}</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {similarMovies.map((movie) => (
                                            <MovieCard key={movie.id} movie={movie} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Recommendations */}
                            {recommendations && recommendations.length > 0 && (
                                <div>
                                    <h2 className="text-3xl font-bold text-white mb-6">⚡ {t('movies.recommendations')}</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                        {recommendations.map((movie) => (
                                            <MovieCard key={movie.id} movie={movie} />
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {showModal && (
                <PlaylistModal
                    movieId={Number(id)}
                    onClose={() => setShowModal(false)}
                />
            )}
            {showTrailer && (
                <TrailerModal
                    movieId={Number(id)}
                    onClose={() => setShowTrailer(false)}
                />
            )}
        </>
    );
};

export default MovieDetail;
