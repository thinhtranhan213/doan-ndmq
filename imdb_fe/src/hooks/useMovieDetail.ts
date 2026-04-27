
import { useState, useEffect } from 'react';
import { getMovieDetails, getMovieCredits, getSimilarMovies, getMovieRecommendations, getMovieReviews } from '../api/endpoints';
import { MovieDetail, Credits, Movie } from '../types/movie.types';
import { useBlacklistStore } from '../store/blacklistStore';

export const useMovieDetail = (movieId: number) => {
    const filterMovies = useBlacklistStore((s) => s.filterMovies);
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<Credits | null>(null);
    const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
    const [recommendations, setRecommendations] = useState<Movie[]>([]);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchMovieData();
    }, [movieId]);

    const fetchMovieData = async () => {
        try {
            setLoading(true);
            setError(null);

            const [movieData, creditsData, similarData, recommendationsData, reviewsData] = await Promise.all([
                getMovieDetails(movieId),
                getMovieCredits(movieId),
                getSimilarMovies(movieId),
                getMovieRecommendations(movieId),
                getMovieReviews(movieId),
            ]);

            setMovie(movieData);
            setCredits(creditsData);
            setSimilarMovies(filterMovies(similarData.results).slice(0, 10));
            setRecommendations(filterMovies(recommendationsData.results).slice(0, 10));
            setReviews(reviewsData.results.slice(0, 5));
        } catch (err) {
            setError('Failed to fetch movie details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return { movie, credits, similarMovies, recommendations, reviews, loading, error, setReviews };
};
