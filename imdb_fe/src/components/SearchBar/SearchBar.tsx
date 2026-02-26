
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from '../../utils/constants';
import { useMovieSearch } from '../../hooks/useMovies';

const SearchBar: React.FC = () => {
    const [query, setQuery] = useState('');
    const [showResults, setShowResults] = useState(false);
    const navigate = useNavigate();
    const { results, loading } = useMovieSearch(query);

    const handleSearch = useCallback(
        debounce((value: string) => {
            setQuery(value);
            setShowResults(value.length > 0);
        }, 500),
        []
    );

    const handleMovieClick = (movieId: number) => {
        navigate(`/movie/${movieId}`);
        setShowResults(false);
        setQuery('');
    };

    return (
        <div className="relative w-full max-w-xl">
            <input
                type="text"
                placeholder="Search movies..."
                onChange={(e) => handleSearch(e.target.value)}
                onFocus={() => query && setShowResults(true)}
                onBlur={() => setShowResults(false)}
                className="w-full px-4 py-2 bg-gray-700 text-white rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-imdb-yellow"
            />

            {showResults && (
                <div
                    className="absolute z-50 w-full mt-2 bg-gray-800 rounded-lg
                               shadow-xl max-h-96 overflow-y-auto"
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {loading && (
                        <div className="p-4 text-center text-gray-400">
                            Searching...
                        </div>
                    )}

                    {!loading && results.length === 0 && (
                        <div className="p-4 text-center text-gray-400">
                            No results found
                        </div>
                    )}

                    {!loading &&
                        results.slice(0, 5).map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => handleMovieClick(movie.id)}
                                className="flex items-center gap-3 p-3
                                           hover:bg-gray-700 cursor-pointer transition"
                            >
                                <img
                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                    alt={movie.title}
                                    className="w-12 h-16 object-cover rounded"
                                />
                                <div>
                                    <h4 className="text-white font-medium">
                                        {movie.title}
                                    </h4>
                                    <p className="text-sm text-gray-400">
                                        {movie.release_date?.split('-')[0]}
                                    </p>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};


export default SearchBar;
