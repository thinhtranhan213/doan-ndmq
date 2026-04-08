
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getMoviesByGenreFromBackend } from '../../api/endpoints';
import { Movie } from '../../types/movie.types';
import MovieCard from '../../components/MovieCard/MovieCard';
import Pagination from '../../components/Pagination/Pagination';
import Footer from '../../components/Footer/Footer';

interface Genre {
    id: number;
    name: string;
    emoji: string;
    description: string;
}

const GENRES: Genre[] = [
    { id: 28, name: 'Action', emoji: '🎬', description: 'These action movies are thrilling and visually stunning, featuring breathtaking action sequences' },
    { id: 35, name: 'Comedy', emoji: '😂', description: 'Comedy films bring laughter and joy to the audience' },
    { id: 18, name: 'Drama', emoji: '🎭', description: 'Dramatic, emotional, and profound stories about life' },
    { id: 27, name: 'Horror', emoji: '👻', description: 'These terrifying horror movies will leave you breathless' },
    { id: 878, name: 'Science Fiction', emoji: '🚀', description: 'Explore the future, technology, and fascinating fantasy worlds' },
    { id: 53, name: 'Thriller', emoji: '🔪', description: 'These thrilling and suspenseful films will keep you glued to the screen' },
    { id: 10749, name: 'Romance', emoji: '💕', description: 'Romantic love stories that touch the heart' },
    { id: 16, name: 'Animation', emoji: '🎨', description: 'Colorful and creative animated films for all ages' },
];

const GenrePage: React.FC = () => {
    const { genreId } = useParams<{ genreId: string }>();
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
            document.title = `${genre.emoji} ${genre.name} Movies - IMDb Movie Review`;
        } else {
            document.title = 'Genre Not Found - IMDb Movie Review';
        }

        return () => {
            document.title = 'IMDb Movie Review';
        };
    }, [genre]);

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
            setMovies(response.results);
            setTotalPages(Math.min(response.total_pages, 500)); // TMDb giới hạn 500 trang
        } catch (err) {
            console.error('Error fetching movies:', err);
            setError('Không thể tải danh sách phim. Vui lòng thử lại sau.');
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
                            Genre not found
                        </h1>
                        <p className="text-gray-400 mb-8">
                            The type of genre you're looking for doesn't exist.
                        </p>
                        <Link
                            to="/"
                            className="inline-block bg-imdb-yellow text-black font-semibold px-8 py-3 rounded hover:bg-yellow-500 transition"
                        >
                            Back to home
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
                        {genre.name} Movies
                    </h1>
                    <p className="text-gray-400 text-lg max-w-3xl">
                        {genre.description}
                    </p>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-900/30 border border-red-700 text-red-400 px-6 py-4 rounded-lg mb-8">
                        <p className="font-semibold mb-2">Đã xảy ra lỗi</p>
                        <p>{error}</p>
                        <button
                            onClick={() => fetchMovies(currentPage)}
                            className="mt-4 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded transition"
                        >
                            Thử lại
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
                            Không tìm thấy phim nào
                        </h2>
                        <p className="text-gray-400">
                            Hiện tại không có phim nào trong thể loại này.
                        </p>
                    </div>
                )}
            </div>
            <Footer />

        </div>

    );
};

export default GenrePage;
