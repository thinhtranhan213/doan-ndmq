
import { useState, useEffect } from 'react';
import { getMovieDetails, getMovieCredits, getSimilarMovies, getMovieRecommendations } from '../api/endpoints';
import { MovieDetail, Credits, Movie } from '../types/movie.types';
import { useBlacklistStore } from '../store/blacklistStore';

export const useMovieDetail = (movieId: number) => {
    const filterMovies = useBlacklistStore((s) => s.filterMovies);
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMovieData();
    }, [movieId]);

    const fetchMovieData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [movieData, creditsData, similarData, recommendationsData] = await Promise.all([
                getMovieDetails(movieId),
                getMovieCredits(movieId),
                getSimilarMovies(movieId),
                getMovieRecommendations(movieId),
            ]);

            setMovie(movieData);
            setCredits(creditsData);
            setSimilarMovies(filterMovies(similarData.results).slice(0, 10));
            setRecommendations(filterMovies(recommendationsData.results).slice(0, 10));
        } catch (err) {
            setError('Failed to fetch movie details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { movie, credits, similarMovies, recommendations, loading, error };
};
