import React from 'react';
import { useParams } from 'react-router-dom';
import { useMovieDetail } from '../../hooks/useMovieDetail';
import MovieCard from '../../components/MovieCard/MovieCard';
import { getImageUrl, IMAGE_SIZES, formatDate, formatRuntime, formatCurrency } from '../../utils/constants';
import { useState } from 'react';
import { createReview } from '../../api/endpoints';

const MovieDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    // const navigate = useNavigate();
    const { movie, credits, similarMovies, recommendations, reviews, loading, error, setReviews } = useMovieDetail(Number(id));
    const [showAllCast, setShowAllCast] = useState(false);
    // const [showAllReviews, setShowAllReviews] = useState(false);

    const [comment, setComment] = useState('');
    const [rating, setRating] = useState<number>(0);
    const [submitting, setSubmitting] = useState(false);
    
    

    const handleSubmitReview = async () => {
        if (!comment || rating === 0) return;

        try {
            setSubmitting(true);
            
            const newReview = await createReview(Number(id), {
                comment,
                rating
            });

            // 🔥 add vào list hiện tại
            setReviews((prev) => [newReview, ...prev]);

            setComment('');
            setRating(0);

        } catch (err) {
            console.error(err);
            alert("Failed to submit review");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-imdb-yellow"></div>
            </div>
        );
    }

    if (error || !movie) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-500 text-white p-4 rounded-lg">
                    {error || 'Movie not found'}
                </div>
            </div>
        );
    }

    // Lấy director từ credits
    const director = credits?.crew.find((c) => c.job === 'Director');
    const writers = credits?.crew.filter((c) => c.job === 'Writer').slice(0, 3);

    return (
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
                {/* <div className="container mx-auto px-4 h-full flex items-end pb-8">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg hover:bg-opacity-70 transition"
                    >
                        ← Back
                    </button>
                </div> */}
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

                        {/* Overview */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-white mb-2">Synopsis</h2>
                            <p className="text-gray-300 leading-relaxed">{movie.overview}</p>
                        </div>

                        {/* Director & Writers */}
                        {(director || writers) && (
                            <div className="mb-6 bg-slate-800 p-4 rounded-lg">
                                {director && (
                                    <div className="mb-3">
                                        <p className="text-gray-400 text-sm">Director</p>

                                        <p className="text-white cursor-pointer font-semibold hover:underline">
                                            {director.name}
                                        </p>
                                    </div>
                                )}
                                {writers && writers.length > 0 && (
                                    <div>
                                        <p className="text-gray-400 text-sm">Writers</p>
                                        <p className="text-white font-semibold cursor-pointer hover:underline">{writers.map((w) => w.name).join(', ')}</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 bg-imdb-gray p-4 rounded-lg mb-6">
                            <div>
                                <p className="text-gray-400 text-sm">Status</p>
                                <p className="text-white font-semibold">{movie.status}</p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Budget</p>
                                <p className="text-white font-semibold">
                                    {movie.budget ? formatCurrency(movie.budget) : 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm">Revenue</p>
                                <p className="text-white font-semibold">
                                    {movie.revenue ? formatCurrency(movie.revenue) : 'N/A'}
                                </p>
                            </div>
                            {movie.spoken_languages && movie.spoken_languages.length > 0 && (
                                <div>
                                    <p className="text-gray-400 text-sm">Languages</p>
                                    <p className="text-white font-semibold text-sm">
                                        {movie.spoken_languages.map((lang) => lang.name).join(', ')}
                                    </p>
                                </div>
                            )}
                            {movie.production_companies && movie.production_companies.length > 0 && (
                                <div className="md:col-span-2">
                                    <p className="text-gray-400 text-sm">Production</p>
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
                                <h2 className="text-3xl font-bold text-white mb-6">👥 Top Cast</h2>

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
                                            {showAllCast ? 'Show less ▲' : 'Show all cast ▼'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* User Comment Section */}
                        <div className="mb-12 bg-slate-800 p-6 rounded-lg">
                            <h2 className="text-2xl font-bold text-white mb-4">📝 Your Review</h2>

                            {/* Rating */}
                            <div className="mb-4">
                                <p className="text-gray-400 mb-2">Your Rating</p>
                                <div className="flex gap-2 flex-wrap">
                                    {[...Array(10)].map((_, i) => {
                                        const value = i + 1;
                                        return (
                                            <button
                                                key={value}
                                                onClick={() => setRating(value)}
                                                className={`px-3 py-1 rounded 
                            ${rating >= value
                                                        ? 'bg-imdb-yellow text-white'
                                                        : 'bg-imdb-gray text-gray-300'
                                                    }`}
                                            >
                                                {value}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Comment Input */}
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Write your thoughts about this movie..."
                                className="w-full p-3 rounded bg-imdb-gray text-white mb-4"
                                rows={4}
                            />

                            {/* Submit */}
                            <button
                                onClick={handleSubmitReview}
                                disabled={submitting}
                                className="bg-imdb-yellow text-white px-4 py-2 rounded hover:bg-yellow-500 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>

                        {/* Reviews Section */}
                        {reviews.map((review) => {
                            const avatarUrl = review.author_details?.avatar_path
                                ? review.author_details.avatar_path.startsWith('/https')
                                    ? review.author_details.avatar_path.slice(1)
                                    : getImageUrl(review.author_details.avatar_path)
                                : null

                            return (
                                <div
                                    key={review.id}
                                    className="relative mb-12 bg-slate-800 p-4 pl-14 rounded-lg"
                                >
                                    {/* Avatar */}
                                    <div className="absolute -top-4 -left-4">
                                        {avatarUrl ? (
                                            <img
                                                src={getImageUrl(avatarUrl)}
                                                alt={review.author}
                                                className="w-12 h-12 rounded-full border-2 border-imdb-dark object-cover bg-gray-700"
                                            />
                                        ) : (
                                            <div className="w-12 h-12 rounded-full bg-imdb-gray border-2 border-imdb-dark flex items-center justify-center text-white font-bold">
                                                {review.author.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>

                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-2">
                                        <div>
                                            <p className="text-white font-semibold">{review.author}</p>
                                            <p className="text-gray-400 text-sm">
                                                {new Date(review.created_at).toLocaleDateString()}
                                            </p>
                                        </div>

                                        {review.author_details?.rating !== null && review.author_details?.rating !== undefined && (
                                            <div className="bg-imdb-yellow text-white px-2 py-1 rounded font-bold text-sm">
                                                ⭐ {review.author_details.rating}/10
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <p className="text-gray-300 line-clamp-4">{review.content}</p>

                                    {/* Link */}
                                    <a
                                        href={review.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-imdb-yellow hover:underline text-sm mt-2 inline-block"
                                    >
                                        Read full review →
                                    </a>
                                </div>
                            )
                        })}


                        {/* Similar Movies */}
                        {similarMovies && similarMovies.length > 0 && (
                            <div className="mb-12">
                                <h2 className="text-3xl font-bold text-white mb-6">🎬 Similar Movies</h2>
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
                                <h2 className="text-3xl font-bold text-white mb-6">⚡ Recommendations</h2>
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
    );
};

export default MovieDetail;
