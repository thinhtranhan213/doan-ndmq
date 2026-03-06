
import { useState, useEffect } from 'react';
import { getPopularMovies, searchMovies } from '../api/endpoints';
import { Movie } from '../types/movie.types';
import { useMovieStore } from '../store/movieStore';

export const useMovies = (initialPage: number = 1) => {
    const [page, setPage] = useState(initialPage);
    const [currentPageMovies, setCurrentPageMovies] = useState<Movie[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const { loading, error, setLoading, setError } = useMovieStore();

    useEffect(() => {
        fetchMovies();
    }, [page]);

    const fetchMovies = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await getPopularMovies(page);
            setCurrentPageMovies(data.results);
            // Lấy tổng số trang từ API (tối đa 500 theo TMDb)
            setTotalPages(Math.min(data.total_pages, 500));
        } catch (err) {
            setError('Failed to fetch movies. Please try again later.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const goToPage = (pageNumber: number) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setPage(pageNumber);
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const nextPage = () => {
        if (page < totalPages) {
            goToPage(page + 1);
        }
    };

    const prevPage = () => {
        if (page > 1) {
            goToPage(page - 1);
        }
    };

    return {
        movies: currentPageMovies,
        loading,
        error,
        page,
        maxPages: totalPages,
        nextPage,
        prevPage,
        goToPage,
    };
};

export const useMovieSearch = (query: string, delay: number = 500) => {
    const [results, setResults] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await searchMovies(query);
                setResults(data.results);
            } catch (err) {
                setError('Search failed. Please try again.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        }, delay);

        return () => clearTimeout(timeoutId);
    }, [query, delay]);

    return { results, loading, error };
};
