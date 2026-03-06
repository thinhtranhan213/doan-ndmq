
import React, { useState } from 'react';
import { useMovieSearch } from '../../hooks/useMovies';
import MovieList from '../../components/MovieList/MovieList';

const Search: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { results, loading, error } = useMovieSearch(searchQuery);

    return (
        <div id="search-page-wrapper" className="min-h-screen w-full flex flex-col items-center pt-20 pb-20 px-4">
            <div className="container mx-auto max-w-7xl">
                <h1 id="search-page-title" className="text-4xl font-bold text-white mb-12">Search Movies</h1>

                {/* Search Input */}
                <div id="search-input-section" className="mb-12">
                    <input
                        type="text"
                        placeholder="Search for movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full max-w-2xl px-4 py-3 bg-imdb-gray text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-imdb-yellow text-lg"
                    />
                </div>

                {/* Error Message */}
                {error && (
                    <div id="search-error-message" className="bg-red-500 text-white p-4 rounded-lg mb-6">
                        {error}
                    </div>
                )}

                {/* Results */}
                {searchQuery && (
                    <div id="search-results-section">
                        <h2 className="text-2xl font-semibold text-white mb-4">
                            {loading ? 'Searching...' : `Results for "${searchQuery}"`}
                        </h2>
                        <MovieList movies={results} loading={loading} />
                    </div>
                )}

                {/* Empty State */}
                {!searchQuery && (
                    <div id="search-empty-state" className="text-center text-gray-400 py-20">
                        <p className="text-xl">Start typing to search for movies</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
