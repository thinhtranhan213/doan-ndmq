
import axios from "axios";
import tmdbApi from "./tmdb";
import { Movie, MovieDetail, ApiResponse, Credits, ImageConfig, Genre, Review, VideoResponse } from "../types/movie.types";

// Create axios instance for backend API
const backendApi = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json',
    }
});

// Get image configuration
export const getConfiguration = async (): Promise<ImageConfig> => {
    const response = await tmdbApi.get('/configuration');
    return response.data.images;
};

// Get all genres
export const getGenres = async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/movie/list', {
        params: { language: 'en-US' },
    });
    return response.data.genres;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/discover/movie', {
        params: {
            with_genres: genreId,
            page,
            language: 'en-US',
            sort_by: 'popularity.desc',
        },
    });
    return response.data;
};

// Get popular movies
export const getPopularMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/popular', {
        params: { page, language: 'en-US' },
    });
    return response.data;
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<MovieDetail> => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: { language: 'en-US' },
    });
    return response.data;
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId: number): Promise<Credits> => {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`, {
        params: { language: 'en-US' },
    });
    return response.data;
};

// Get similar movies
export const getSimilarMovies = async (movieId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
        params: { page, language: 'en-US' },
    });
    return response.data;
};

// Get movie recommendations
export const getMovieRecommendations = async (movieId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: { page, language: 'en-US' },
    });
    return response.data;
};

// Get movie reviews
export const getMovieReviews = async (movieId: number, page: number = 1): Promise<ApiResponse<Review>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/reviews`, {
        params: { page, language: 'en-US' },
    });
    return response.data;
};

// Get movie videos
export const getMovieVideos = async (movieId: number): Promise<VideoResponse> => {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`, {
        params: { language: 'en-US' },
    });
    return response.data;
};

// Search movies by query
export const searchMovies = async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/search/movie', {
        params: { query, page, language: 'en-US' },
    });
    return response.data;
};

// Get trending movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
        params: { language: 'en-US' },
    });
    return response.data;
};

// Get top rated movies
export const getTopRatedMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/top_rated', {
        params: { page, language: 'en-US' },
    });
    return response.data;
};

// ======================================
// Backend API Endpoints (Home Page)
// ======================================

// Get trending movies from backend
export const getTrendingMoviesFromBackend = async (timeWindow: 'day' | 'week' = 'week'): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/trending', {
        params: { timeWindow },
    });
    return response.data;
};

// Get top rated movies from backend
export const getTopRatedMoviesFromBackend = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/top-rated', {
        params: { page },
    });
    return response.data;
};

// Get popular movies from backend
export const getPopularMoviesFromBackend = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/popular', {
        params: { page },
    });
    return response.data;
};
