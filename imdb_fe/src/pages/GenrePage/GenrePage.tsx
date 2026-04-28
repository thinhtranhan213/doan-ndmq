
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getMoviesByGenreFromBackend } from '../../api/endpoints';
import { Movie } from '../../types/movie.types';
import { useBlacklistStore } from '../../store/blacklistStore';
import MovieCard from '../../components/MovieCard/MovieCard';
import Pagination from '../../components/Pagination/Pagination';
import Footer from '../../components/Footer/Footer';

interface Genre {
    id: number;
    name: string;
    emoji: string;
    descriptionKey: string;
}

const GENRES: Genre[] = [
    { id: 28, name: 'Action', emoji: '🎬', descriptionKey: 'genres.actionDescription' },
    { id: 35, name: 'Comedy', emoji: '😂', descriptionKey: 'genres.comedyDescription' },
    { id: 18, name: 'Drama', emoji: '🎭', descriptionKey: 'genres.dramaDescription' },
    { id: 27, name: 'Horror', emoji: '👻', descriptionKey: 'genres.horrorDescription' },
    { id: 878, name: 'Science Fiction', emoji: '🚀', descriptionKey: 'genres.scifiDescription' },
    { id: 53, name: 'Thriller', emoji: '🔪', descriptionKey: 'genres.thrillerDescription' },
    { id: 10749, name: 'Romance', emoji: '💕', descriptionKey: 'genres.romanceDescription' },
    { id: 16, name: 'Animation', emoji: '🎨', descriptionKey: 'genres.animationDescription' },
];

const GenrePage: React.FC = () => {
    const { t } = useTranslation();
    const { genreId } = useParams<{ genreId: string }>();
    const filterMovies = useBlacklistStore((s) => s.filterMovies);
    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Tìm thông tin thể loại
    const genre = GENRES.find(g => g.id === Number(genreId));

    useEffect(() => {
        // Cập nhật document title
        if (genre) {
            document.title = `${genre.emoji} ${t(`genres.${genre.name}`)} Movies - IMDb Movie Review`;
        } else {
            document.title = 'Genre Not Found - IMDb Movie Review';
        }

        return () => {
            document.title = 'IMDb Movie Review';
        };
    }, [genre, t]);

    useEffect(() => {
        if (genre) {
            fetchMovies(currentPage);
        }
    }, [genreId, currentPage, genre]);

    const fetchMovies = async (page: number) => {
        try {
            setLoading(true);
            setError(null);
            const response = await getMoviesByGenreFromBackend(Number(genreId), page);
            setMovies(filterMovies(response.results));
            setTotalPages(Math.min(response.total_pages, 500)); // TMDb giới hạn 500 trang
        } catch (err) {
            console.error('Error fetching movies:', err);
            setError(t('movies.errorLoading'));
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Nếu genre không tồn tại
    if (!genre) {
        return (
            <div className="min-h-screen bg-imdb-dark pt-24 pb-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">😕</div>
                        <h1 className="text-3xl font-bold text-white mb-4">
                            {t('movies.genreNotFound')}
                        </h1>
                        <p className="text-gray-400 mb-8">
                            {t('movies.genreNotFoundDescription')}
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-imdb-yellow text-black font-semibold px-8 py-3 rounded hover:bg-yellow-500 transition"
                        >
                            {t('common.backToHome')}
                        </Link>
                    </div>
                </div>
                <Footer />

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-imdb-dark pt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        <span className="mr-3">{genre.emoji}</span>
                        {t(`genres.${genre.name}`)}
                    </h1>
                    <p className="text-gray-400 text-lg max-w-3xl">
                        {t(genre.descriptionKey)}
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-900/30 border border-red-700 text-red-400 px-6 py-4 rounded-lg mb-8">
                        <p className="font-semibold mb-2">{t('movies.anErrorOccurred')}</p>
                        <p>{error}</p>
                        <button
                            onClick={() => fetchMovies(currentPage)}
                            className="mt-4 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                            {t('common.retry')}
                        </button>
                    </div>
                )}

                {/* Loading State */}
                {loading && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {[...Array(20)].map((_, index) => (
                            <div key={index} className="animate-pulse">
                                <div className="bg-slate-800 rounded-lg overflow-hidden">
                                    <div className="aspect-[2/3] bg-slate-700"></div>
                                    <div className="p-3">
                                        <div className="h-4 bg-slate-700 rounded mb-2"></div>
                                        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Movies Grid */}
                {!loading && movies.length > 0 && (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
                            {movies.map((movie) => (
                                <MovieCard key={movie.id} movie={movie} />
                            ))}
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            maxPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </>
                )}

                {/* Empty State */}
                {!loading && !error && movies.length === 0 && (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-4">{genre.emoji}</div>
                        <h2 className="text-2xl font-bold text-white mb-4">
                            {t('movies.noMoviesFound')}
                        </h2>
                        <p className="text-gray-400">
                            {t('movies.noMoviesInGenre')}
                        </p>
                    </div>
                )}
            </div>
            <Footer />

        </div>

    );
};

export default GenrePage;
