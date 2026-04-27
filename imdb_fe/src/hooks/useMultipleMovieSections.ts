
import { useState, useEffect } from 'react';
import { getTrendingMoviesFromBackend, getTopRatedMoviesFromBackend, getPopularMoviesFromBackend } from '../api/endpoints';
import { Movie } from '../types/movie.types';
import { useBlacklistStore } from '../store/blacklistStore';

interface MovieSections {
    trending: Movie[];
    topRated: Movie[];
    popular: Movie[];
    loading: boolean;
    error: string | null;
}

export const useMultipleMovieSections = () => {
    const filterMovies = useBlacklistStore((s) => s.filterMovies);
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

            const [trendingData, topRatedData, popularData] = await Promise.all([
                getTrendingMoviesFromBackend('week'),
                getTopRatedMoviesFromBackend(1),
                getPopularMoviesFromBackend(1),
            ]);

            setSections({
                trending: filterMovies(trendingData.results),
                topRated: filterMovies(topRatedData.results),
                popular:  filterMovies(popularData.results),
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
