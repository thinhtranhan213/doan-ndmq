import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../store/authStore';
import { usePlaylistStore } from '../../store/playlistStore';
import { getCurrentUserProfile, ProfileResponse } from '../../api/auth';
import { getPlaylists, getPlaylistMovies, getMovieDetails } from '../../api/endpoints';
import { Movie } from '../../types/movie.types';
import Footer from '../../components/Footer/Footer';
import ProfilePlaylists from './ProfilePlaylists';
import ProfileReviews from './ProfileReviews';

const Profile: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [userProfile, setUserProfile] = useState<ProfileResponse['user'] | null>(null);
    const [stats, setStats] = useState<ProfileResponse['stats'] | null>(null);

    const [loading, setLoading] = useState(true);

    // Playlist movies states
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [recentlyViewedMovies, setRecentlyViewedMovies] = useState<Movie[]>([]);
    const [watchLaterMovies, setWatchLaterMovies] = useState<Movie[]>([]);

    const [playlistLoading, setPlaylistLoading] = useState(false);
    const { toggleMovieInPlaylist } = usePlaylistStore();
    const [removingMovieId, setRemovingMovieId] = useState<{ [key: string]: number | null }>({
        favorites: null,
        recentlyViewed: null,
        watchLater: null
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    // Function to refresh all playlists
    const refreshAllPlaylists = async () => {
        try {
            setPlaylistLoading(true);
            const playlists = await getPlaylists(0) as any[];

            // Playlist names
            const playlistNames = {
                favorites: 'My Watchlist',
                recentlyViewed: 'Recently Viewed',
                watchLater: 'Watch Later'
            };

            // Load each playlist
            const playlistUpdates: any = {};

            for (const [key, name] of Object.entries(playlistNames)) {
                const playlist = playlists.find((p) => p.name === name);
                if (playlist) {
                    const movieData = await getPlaylistMovies(playlist.id) as any[];
                    if (movieData && movieData.length > 0) {
                        const moviesPromises = movieData.slice(0, 8).map((item: any) =>
                            getMovieDetails(item.movieId).catch(() => null)
                        );
                        const movieDetails = await Promise.all(moviesPromises);
                        const filtered = movieDetails.filter(m => m !== null) as Movie[];
                        playlistUpdates[key] = filtered;
                    } else {
                        playlistUpdates[key] = [];
                    }
                }
            }

            setFavoriteMovies(playlistUpdates.favorites || []);
            setRecentlyViewedMovies(playlistUpdates.recentlyViewed || []);
            setWatchLaterMovies(playlistUpdates.watchLater || []);
        } catch (err) {
            console.error('Failed to refresh playlists:', err);
        } finally {
            setPlaylistLoading(false);
        }
    };

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const profile = await getCurrentUserProfile();
                setUserProfile(profile.user);
                setStats(profile.stats)
            } catch (err) {
                console.error('Failed to load user profile', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated]);

    // Fetch all playlists on component mount
    useEffect(() => {
        if (isAuthenticated) {
            refreshAllPlaylists();
        }
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
                <div className="text-white">{t('profile.loadingProfile')}</div>
            </div>
        );
    }

    const joinDate = userProfile?.createdAt
        ? new Date(userProfile.createdAt).toLocaleDateString('vi-VN', { year: 'numeric', month: 'short' })
        : 'Mar 2026';

    const userInitial = userProfile?.firstName?.charAt(0).toUpperCase() || userProfile?.email?.charAt(0).toUpperCase() || 'U';
    const fullName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim();

    return (
        <div className="min-h-screen bg-slate-950 pt-0">
            {/* Profile Header Background */}
            <div className="bg-gradient-to-b from-slate-900 to-slate-950 pt-8">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* User Header */}
                    <div className="flex flex-col sm:flex-row items-start gap-6 pb-8">
                        {/* Avatar */}
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0">
                            <span className="text-5xl font-bold text-white">{userInitial}</span>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 pt-4">
                            <h1 className="text-3xl font-bold text-white mb-2">{fullName || userProfile?.email || 'User'}</h1>
                            <p className="text-slate-400 mb-4">{t('profile.joined')} {joinDate}</p>
                            <button
                                onClick={() => navigate('/edit-profile')}
                                className="px-6 py-2 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors"
                            >
                                {t('profile.editProfile')}
                            </button>
                        </div>

                        {/* Right Side Stats */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{stats?.totalReviews ?? 0}</div>
                                <div className="text-slate-400 text-sm">{t('profile.ratings')}</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">{stats?.totalPlaylists ?? 0}</div>
                                <div className="text-slate-400 text-sm">{t('profile.watchlist')}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Badges Section */}
                {/* <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">{t('profile.badges')}</h2>
                        <span className="text-slate-400">&gt;</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2">
                                <span className="text-2xl font-bold">IMDb</span>
                            </div>
                            <p className="text-white text-sm">{t('profile.imdbMember')}</p>
                            <p className="text-slate-400 text-xs">1 day</p>
                        </div>
                        <button className="ml-4 px-6 py-2 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors text-sm">
                            {t('profile.exploreBadges')}
                        </button>
                    </div>
                </section> */}

                {/* Reviews Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">Đánh giá của tôi</h2>
                        <span className="text-slate-400 text-sm">({stats?.totalReviews ?? 0})</span>
                    </div>
                    <ProfileReviews />
                </section>

                {/* Watchlist Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">{t('profile.watchlist')}</h2>
                            <span className="text-slate-400">&gt;</span>
                        </div>
                    </div>

                    {playlistLoading ? (
                        <div className="bg-slate-900 rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-imdb-yellow mx-auto"></div>
                            <p className="text-slate-400 mt-4">{t('movies.loading')}</p>
                        </div>
                    ) : favoriteMovies.length === 0 ? (
                        <div className="bg-slate-900 rounded-lg p-8 text-center mb-4">
                            <p className="text-slate-400 mb-4">{t('profile.noRatingsYet')}</p>
                            <p className="text-slate-500 text-sm">{t('profile.trackWatchlistMessage')}</p>
                        </div>
                    ) : (
                        <>
                            {/* Movie Grid */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
                                {favoriteMovies.map((movie: Movie) => (
                                    <div key={movie.id} className="group">
                                        <div
                                            className="relative overflow-hidden rounded bg-slate-800 aspect-[2/3] mb-2 cursor-pointer"
                                            onClick={() => navigate(`/movie/${movie.id}`)}
                                        >
                                            {/* Background Image */}
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="text-slate-500">{t('profile.noImage')}</span>
                                                </div>
                                            )}

                                            {/* Dark Overlay + Remove Button - Show on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded pointer-events-none"></div>

                                            {/* Heart Button - Show on hover */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setRemovingMovieId(prev => ({ ...prev, favorites: movie.id }));
                                                    toggleMovieInPlaylist('favorites', movie.id).finally(() => {
                                                        setRemovingMovieId(prev => ({ ...prev, favorites: null }));
                                                        refreshAllPlaylists();
                                                    });
                                                }}
                                                disabled={removingMovieId.favorites === movie.id}
                                                className="absolute top-2 right-2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100"
                                                title={t('movies.removeFromWatchlist')}
                                            >
                                                {removingMovieId.favorites === movie.id ? (
                                                    <span className="animate-spin">⌛</span>
                                                ) : (
                                                    <span className="text-lg">❤️</span>
                                                )}
                                            </button>
                                        </div>
                                        <p className="text-white text-xs text-center truncate">{movie.title}</p>
                                    </div>
                                ))}
                            </div>

                            {/* <div className="text-center">
                                <button onClick={() => navigate('/search')} className="px-6 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors">
                                    {t('profile.browseAllUpcomingReleases')}
                                </button>
                            </div> */}
                        </>
                    )}
                </section>

                {/* Lists Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">🕐 {t('profile.recentlyViewed')}</h2>
                            <span className="text-slate-400">&gt;</span>
                        </div>
                    </div>

                    {playlistLoading ? (
                        <div className="bg-slate-900 rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-imdb-yellow mx-auto"></div>
                            <p className="text-slate-400 mt-4">{t('movies.loading')}</p>
                        </div>
                    ) : recentlyViewedMovies.length === 0 ? (
                        <div className="bg-slate-900 rounded-lg p-8 text-center mb-4">
                            <p className="text-slate-400 mb-4">{t('profile.noRecentlyViewedPages')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
                                {recentlyViewedMovies.map((movie: Movie) => (
                                    <div key={movie.id} className="group">
                                        <div
                                            className="relative overflow-hidden rounded bg-slate-800 aspect-[2/3] mb-2 cursor-pointer"
                                            onClick={() => navigate(`/movie/${movie.id}`)}
                                        >
                                            {movie.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><span className="text-slate-500">{t('profile.noImage')}</span></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded pointer-events-none"></div>
                                            <button onClick={(e) => { e.stopPropagation(); setRemovingMovieId(prev => ({ ...prev, recentlyViewed: movie.id })); toggleMovieInPlaylist('recentlyViewed', movie.id).finally(() => { setRemovingMovieId(prev => ({ ...prev, recentlyViewed: null })); refreshAllPlaylists(); }); }} disabled={removingMovieId.recentlyViewed === movie.id} className="absolute top-2 right-2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100" title={t('movies.removeFromWatchlist')}>
                                                {removingMovieId.recentlyViewed === movie.id ? <span className="animate-spin">⌛</span> : <span className="text-lg">🔖</span>}
                                            </button>
                                        </div>
                                        <p className="text-white text-xs text-center truncate">{movie.title}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Watch Later Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">📅 {t('profile.watchLater') || 'Watch Later'}</h2>
                            <span className="text-slate-400">&gt;</span>
                        </div>
                    </div>

                    {playlistLoading ? (
                        <div className="bg-slate-900 rounded-lg p-8 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-imdb-yellow mx-auto"></div>
                            <p className="text-slate-400 mt-4">{t('movies.loading')}</p>
                        </div>
                    ) : watchLaterMovies.length === 0 ? (
                        <div className="bg-slate-900 rounded-lg p-8 text-center mb-4">
                            <p className="text-slate-400 mb-4">{t('profile.noListsYet')}</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
                                {watchLaterMovies.map((movie: Movie) => (
                                    <div key={movie.id} className="group">
                                        <div
                                            className="relative overflow-hidden rounded bg-slate-800 aspect-[2/3] mb-2 cursor-pointer"
                                            onClick={() => navigate(`/movie/${movie.id}`)}
                                        >
                                            {movie.poster_path ? (
                                                <img src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`} alt={movie.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center"><span className="text-slate-500">{t('profile.noImage')}</span></div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded pointer-events-none"></div>
                                            <button onClick={(e) => { e.stopPropagation(); setRemovingMovieId(prev => ({ ...prev, watchLater: movie.id })); toggleMovieInPlaylist('watchLater', movie.id).finally(() => { setRemovingMovieId(prev => ({ ...prev, watchLater: null })); refreshAllPlaylists(); }); }} disabled={removingMovieId.watchLater === movie.id} className="absolute top-2 right-2 z-30 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed opacity-0 group-hover:opacity-100" title={t('movies.removeFromWatchlist')}>
                                                {removingMovieId.watchLater === movie.id ? <span className="animate-spin">⌛</span> : <span className="text-lg">📅</span>}
                                            </button>
                                        </div>
                                        <p className="text-white text-xs text-center truncate">{movie.title}</p>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </section>

                {/* Custom Playlists Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">Playlist của tôi</h2>
                        <span className="text-slate-400">&gt;</span>
                    </div>
                    <ProfilePlaylists />
                </section>

                {/* Favorite People Section */}
                {/* <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">{t('profile.favoritePeople')}</h2>
                        <span className="text-slate-400">&gt;</span>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-12 text-center">
                        <p className="text-slate-400 mb-6">{t('profile.noFavoritePeopleYet')}</p>
                        <p className="text-slate-500 text-sm mb-6">{t('profile.addToFavoritePeople')}</p>
                        <button className="px-6 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors">
                            {t('profile.browseMostPopularCelebs')}
                        </button>
                    </div>
                </section> */}
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Profile;
