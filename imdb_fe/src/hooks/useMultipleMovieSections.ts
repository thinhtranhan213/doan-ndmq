
import { useState, useEffect } from 'react';
import { getTrendingMovies, getTopRatedMovies, getPopularMovies } from '../api/endpoints';
import { Movie } from '../types/movie.types';

interface MovieSections {
    trending: Movie[];
    topRated: Movie[];
    popular: Movie[];
    loading: boolean;
    error: string | null;
}

export const useMultipleMovieSections = () => {
    const [sections, setSections] = useState<MovieSections>({
        trending: [],
        topRated: [],
        popular: [],
        loading: true,
        error: null,
    });

    useEffect(() => {
        fetchAllSections();
    }, []);

    const fetchAllSections = async () => {
        try {
            setSections((prev) => ({ ...prev, loading: true, error: null }));

            // Fetch tất cả sections song song
            const [trendingData, topRatedData, popularData] = await Promise.all([
                getTrendingMovies('week'),
                getTopRatedMovies(1),
                getPopularMovies(1),
            ]);

            setSections({
                trending: trendingData.results, // Top 10 trending
                topRated: topRatedData.results, // Top 10 rated
                popular: popularData.results, // Top 10 popular
                loading: false,
                error: null,
            });
        } catch (err) {
            setSections((prev) => ({
                ...prev,
                loading: false,
                error: 'Failed to fetch movie sections. Please try again later.',
            }));
            console.error('Error fetching movie sections:', err);
        }
    };

    return sections;
};
