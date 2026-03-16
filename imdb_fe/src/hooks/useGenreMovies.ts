
import { useState, useEffect } from 'react';
import { getMoviesByGenre } from '../api/endpoints';
import { Movie } from '../types/movie.types';

export interface GenreSection {
    id: number;
    name: string;
    emoji: string;
    movies: Movie[];
    loading: boolean;
    error: string | null;
}

export const useGenreMovies = () => {
    const SELECTED_GENRES = [
        { id: 28, name: 'Action', emoji: '🎬' },
        { id: 35, name: 'Comedy', emoji: '😂' },
        { id: 18, name: 'Drama', emoji: '🎭' },
        { id: 27, name: 'Horror', emoji: '👻' },
        { id: 878, name: 'Science Fiction', emoji: '🚀' },
        { id: 53, name: 'Thriller', emoji: '🔪' },
        { id: 10749, name: 'Romance', emoji: '💕' },
        { id: 16, name: 'Animation', emoji: '🎨' },
    ];

    const [genreSections, setGenreSections] = useState<GenreSection[]>(
        SELECTED_GENRES.map(genre => ({
            ...genre,
            movies: [],
            loading: true,
            error: null,
        }))
    );

    const [overallLoading, setOverallLoading] = useState(true);

    useEffect(() => {
        fetchGenreMovies();
    }, []);

    const fetchGenreMovies = async () => {
        try {
            setOverallLoading(true);
            const promises = SELECTED_GENRES.map(genre =>
                getMoviesByGenre(genre.id, 1)
                    .then(response => ({
                        ...genre,
                        movies: response.results,
                        loading: false,
                        error: null,
                    }))
                    .catch(_err => ({
                        ...genre,
                        movies: [],
                        loading: false,
                        error: 'Failed to fetch movies',
                    }))
            );

            const results = await Promise.all(promises);
            setGenreSections(results);
        } catch (err) {
            console.error('Error fetching genre movies:', err);
        } finally {
            setOverallLoading(false);
        }
    };

    return { genreSections, overallLoading };
};
