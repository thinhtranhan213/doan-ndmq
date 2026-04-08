package com.imdb.service;

import com.imdb.dto.response.MovieApiResponse;

public interface IMovieService {
    /**
     * Get trending movies from TMDB API
     * 
     * @param timeWindow 'day' or 'week'
     * @return MovieApiResponse containing list of trending movies
     */
    MovieApiResponse getTrendingMovies(String timeWindow);

    /**
     * Get top rated movies from TMDB API
     * 
     * @param page page number (default 1)
     * @return MovieApiResponse containing list of top rated movies
     */
    MovieApiResponse getTopRatedMovies(Integer page);

    /**
     * Get popular movies from TMDB API
     * 
     * @param page page number (default 1)
     * @return MovieApiResponse containing list of popular movies
     */
    MovieApiResponse getPopularMovies(Integer page);

    /**
     * Get movies by genre from TMDB API
     * 
     * @param genreId genre ID
     * @param page page number (default 1)
     * @return MovieApiResponse containing list of movies for the genre
     */
    MovieApiResponse getMoviesByGenre(Integer genreId, Integer page);

    /**
     * Search movies by query from TMDB API
     * 
     * @param query search query
     * @param page page number (default 1)
     * @return MovieApiResponse containing search results
     */
    MovieApiResponse searchMovies(String query, Integer page);
}
