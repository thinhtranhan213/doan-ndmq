package com.imdb.service;

import com.imdb.dto.response.MovieApiResponse;
import com.imdb.dto.response.MovieDetailResponse;

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
     * @param page    page number (default 1)
     * @return MovieApiResponse containing list of movies for the genre
     */
    MovieApiResponse getMoviesByGenre(Integer genreId, Integer page);

    /**
     * Search movies by query from TMDB API
     * 
     * @param query search query
     * @param page  page number (default 1)
     * @return MovieApiResponse containing search results
     */
    MovieApiResponse searchMovies(String query, Integer page);

    /**
     * Filter movies by multiple criteria
     * 
     * @param genreIds comma-separated genre IDs
     * @param year     release year
     * @param country  country code (ISO 3166-1 alpha-2)
     * @param page     page number (default 1)
     * @return MovieApiResponse containing filtered movies
     */
    MovieApiResponse filterMovies(String genreIds, Integer year, String country, Integer page);

    MovieDetailResponse getMovieDetail(Long movieId);
}
