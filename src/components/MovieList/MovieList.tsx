import React from 'react';
import MovieCard from '../MovieCard/MovieCard';
import { Movie } from '../../types/movie.types';

interface MovieListProps {
    movies: Movie[];
    loading?: boolean;
}

const MovieList: React.FC<MovieListProps> = ({ movies, loading }) => {
    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-imdb-yellow"></div>
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="text-center text-gray-400 py-12">
                <p className="text-xl">No movies found</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 justify-items-center">
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;
