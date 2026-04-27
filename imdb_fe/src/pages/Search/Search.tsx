
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useMovieSearch } from '../../hooks/useMovies';
import MovieList from '../../components/MovieList/MovieList';
import FilterBar from '../../components/FilterBar/FilterBar';
import { filterMoviesFromBackend } from '../../api/endpoints';
import { Movie, ApiResponse } from '../../types/movie.types';

const Search: React.FC = () => {
    const { t } = useTranslation();
    const [searchQuery, setSearchQuery] = useState('');
    const { results, loading, error } = useMovieSearch(searchQuery);
    const [filteredResults, setFilteredResults] = useState<Movie[] | null>(null);
    const [filterLoading, setFilterLoading] = useState(false);
    const [showFilterResults, setShowFilterResults] = useState(false);

    const handleFilter = async (genreIds: string, year: number | undefined, country: string) => {
        if (!genreIds && !year && !country) {
            // Reset filter
            setFilteredResults(null);
            setShowFilterResults(false);
            return;
        }

        setFilterLoading(true);
        try {
            const data = await filterMoviesFromBackend(genreIds, year, country, 1) as ApiResponse<Movie>;
            setFilteredResults(data.results);
            setShowFilterResults(true);
            setSearchQuery(''); // Clear search query when filtering
        } catch (err) {
            console.error('Error filtering movies:', err);
        } finally {
            setFilterLoading(false);
        }
    };

    const displayResults = showFilterResults ? filteredResults : results;
    const isLoading = showFilterResults ? filterLoading : loading;

    return (
        <div id="search-page-wrapper" className="min-h-screen w-full flex flex-col items-center pt-20 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                <h1 id="search-page-title" className="text-4xl font-bold text-white mb-12">{t('movies.searchMovies')}</h1>

                {/* Filter Bar */}
                <FilterBar onFilter={handleFilter} loading={filterLoading} />

                {/* Search Input */}
                <div id="search-input-section" className="mb-12">
                    <input
                        type="text"
                        placeholder={t('movies.searchForMovies')}
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value);
                            setShowFilterResults(false);
                            setFilteredResults(null);
                        }}
                        className="w-full max-w-2xl px-6 py-4 bg-gradient-to-r from-slate-700 via-slate-600 to-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-imdb-yellow text-lg font-semibold shadow-lg hover:shadow-xl hover:shadow-blue-500/30 placeholder:text-gray-300 placeholder:font-medium transition-all duration-300"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div id="search-error-message" className="bg-red-500 text-white p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Results */}
                {(searchQuery || showFilterResults) && (
                    <div id="search-results-section">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            {isLoading ? t('movies.searching') : `${t('movies.resultsFor')} "${searchQuery || (t('movies.filter') || 'Lọc')}"`}
                        </h2>
                        <MovieList movies={displayResults || []} loading={isLoading} />
                    </div>
                )}

                {/* Empty State */}
                {!searchQuery && !showFilterResults && (
                    <div id="search-empty-state" className="text-center text-gray-400 py-20">
                        <p className="text-xl">{t('movies.startTyping')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
