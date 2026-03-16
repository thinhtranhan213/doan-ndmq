import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getCurrentUserProfile, ProfileResponse } from '../../api/auth';
import { useMovies } from '../../hooks/useMovies';
import { Movie } from '../../types/movie.types';
import Footer from '../../components/Footer/Footer';

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [userProfile, setUserProfile] = useState<ProfileResponse['user'] | null>(null);
    const [loading, setLoading] = useState(true);
    const { movies } = useMovies();
    const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const profile = await getCurrentUserProfile();
                setUserProfile(profile.user);
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

    useEffect(() => {
        if (movies.length > 0) {
            setWatchlistMovies(movies.slice(0, 8));
        }
    }, [movies]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    const joinDate = userProfile?.createdAt
        ? new Date(userProfile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
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
                            <p className="text-slate-400 mb-4">Joined {joinDate}</p>
                            <button
                                onClick={() => navigate('/edit-profile')}
                                className="px-6 py-2 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors"
                            >
                                Edit Profile
                            </button>
                        </div>

                        {/* Right Side Stats */}
                        <div className="flex gap-8">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">0</div>
                                <div className="text-slate-400 text-sm">Ratings</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-white">0</div>
                                <div className="text-slate-400 text-sm">Watchlist</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Badges Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">Badges</h2>
                        <span className="text-slate-400">&gt;</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mb-2">
                                <span className="text-2xl font-bold">IMDb</span>
                            </div>
                            <p className="text-white text-sm">IMDb Member</p>
                            <p className="text-slate-400 text-xs">1 day</p>
                        </div>
                        <button className="ml-4 px-6 py-2 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors text-sm">
                            EXPLORE BADGES
                        </button>
                    </div>
                </section>

                {/* Ratings Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">Ratings</h2>
                            <span className="text-slate-400">&gt;</span>
                        </div>
                        <p className="text-slate-400 text-sm cursor-pointer hover:text-white">Edit</p>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-8 text-center mb-4">
                        <p className="text-slate-400 mb-4">No ratings yet</p>
                        <p className="text-slate-500 text-sm mb-6">To share your opinion, choose one of the following movies or TV shows to rate.</p>
                        <button className="px-6 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors">
                            Browse popular movies
                        </button>
                    </div>

                    {/* Movie Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                        {movies.slice(0, 8).map((movie: Movie) => (
                            <div key={movie.id} className="cursor-pointer group">
                                <div className="relative overflow-hidden rounded bg-slate-800 aspect-[2/3] mb-2">
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-slate-500">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-white text-xs text-center truncate">{movie.title}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Watchlist Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">Watchlist</h2>
                            <span className="text-slate-400">&gt;</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-8 text-center mb-4">
                        <p className="text-slate-400 mb-4">No Watchlist yet</p>
                        <p className="text-slate-500 text-sm">To track what you want to watch, click the</p>
                    </div>

                    {/* Movie Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                        {watchlistMovies.map((movie: Movie) => (
                            <div key={movie.id} className="cursor-pointer group">
                                <div className="relative overflow-hidden rounded bg-slate-800 aspect-[2/3] mb-2">
                                    {movie.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w200${movie.poster_path}`}
                                            alt={movie.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <span className="text-slate-500">No Image</span>
                                        </div>
                                    )}
                                </div>
                                <p className="text-white text-xs text-center truncate">{movie.title}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-6">
                        <button className="px-6 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors">
                            Browse all upcoming releases
                        </button>
                    </div>
                </section>

                {/* Lists Section */}
                <section className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-2">
                            <h2 className="text-xl font-bold text-white">Lists</h2>
                            <span className="text-slate-400">&gt;</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-12 text-center">
                        <p className="text-slate-400 mb-6 text-lg">No lists yet</p>
                        <button className="px-6 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors">
                            Create a list
                        </button>
                    </div>
                </section>

                {/* Reviews Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">Reviews</h2>
                        <span className="text-slate-400">&gt;</span>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-12 text-center">
                        <p className="text-slate-400">No reviews yet</p>
                    </div>
                </section>

                {/* Favorite People Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">Favorite people</h2>
                        <span className="text-slate-400">&gt;</span>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-12 text-center">
                        <p className="text-slate-400 mb-6">No favorite people yet</p>
                        <p className="text-slate-500 text-sm mb-6">Add to your favorite people to stay connected more easily.</p>
                        <button className="px-6 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors">
                            Browse most popular celebs
                        </button>
                    </div>
                </section>

                {/* Recently Viewed Section */}
                <section className="mb-12">
                    <div className="flex items-center gap-2 mb-6">
                        <h2 className="text-xl font-bold text-white">Recently viewed</h2>
                    </div>

                    <div className="bg-slate-900 rounded-lg p-12 text-center">
                        <p className="text-slate-400">You have no recently viewed pages</p>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default Profile;
