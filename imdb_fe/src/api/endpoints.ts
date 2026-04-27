
import axios from "axios";
import tmdbApi from "./tmdb";
import { Movie, MovieDetail, ApiResponse, Credits, ImageConfig, Genre, Review, VideoResponse } from "../types/movie.types";
import { getTmdbLanguageCode } from "../utils/languageMapper";

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

backendApi.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");

    console.log('Request interceptor - token:', token ? 'exists' : 'NOT FOUND', 'url:', config.url);

    if (token && !config.url?.includes("/public")) {
        // Set Authorization header using proper method
        config.headers.Authorization = `Bearer ${token}`;
        console.log('✅ Authorization header set for:', config.url);
    } else if (!token) {
        console.warn('⚠️ No token found in localStorage');
    }

    console.log('📤 Request headers:', config.headers);
    return config;
});

// Response interceptor for error handling
backendApi.interceptors.response.use(
    (response) => {
        console.log('✅ Response from:', response.config.url, 'status:', response.status);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.error('❌ 401 Unauthorized - Token might be invalid or expired');
            console.log('Token in localStorage:', localStorage.getItem('authToken'));
        }
        return Promise.reject(error);
    }
);

// Get all genres
export const getGenres = async (): Promise<Genre[]> => {
    const response = await tmdbApi.get('/genre/movie/list', {
        params: { language: getTmdbLanguageCode() },
    });
    return response.data.genres;
};

// Get movies by genre
export const getMoviesByGenre = async (genreId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/discover/movie', {
        params: {
            with_genres: genreId,
            page,
            language: getTmdbLanguageCode(),
            sort_by: 'popularity.desc',
        },
    });
    return response.data;
};

// Get popular movies
export const getPopularMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/popular', {
        params: { page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get movie details
export const getMovieDetails = async (movieId: number): Promise<MovieDetail> => {
    const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: { language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get movie credits (cast and crew)
export const getMovieCredits = async (movieId: number): Promise<Credits> => {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`, {
        params: { language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get similar movies
export const getSimilarMovies = async (movieId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`, {
        params: { page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get movie recommendations
export const getMovieRecommendations = async (movieId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`, {
        params: { page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get movie videos
export const getMovieVideos = async (movieId: number): Promise<VideoResponse> => {
    const response = await tmdbApi.get(`/movie/${movieId}/videos`, {
        params: { language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Search movies by query
export const searchMovies = async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/search/movie', {
        params: { query, page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get trending movies
export const getTrendingMovies = async (timeWindow: 'day' | 'week' = 'week'): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
        params: { language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get top rated movies
export const getTopRatedMovies = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await tmdbApi.get('/movie/top_rated', {
        params: { page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// ======================================
// Backend API Endpoints (Home Page)
// ======================================

// Get trending movies from backend
export const getTrendingMoviesFromBackend = async (timeWindow: 'day' | 'week' = 'week'): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/trending', {
        params: { timeWindow, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get top rated movies from backend
export const getTopRatedMoviesFromBackend = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/top-rated', {
        params: { page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get popular movies from backend
export const getPopularMoviesFromBackend = async (page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/popular', {
        params: { page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Get movies by genre from backend
export const getMoviesByGenreFromBackend = async (genreId: number, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/by-genre', {
        params: { genreId, page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Search movies from backend
export const searchMoviesFromBackend = async (query: string, page: number = 1): Promise<ApiResponse<Movie>> => {
    const response = await backendApi.get('/public/movies/search', {
        params: { query, page, language: getTmdbLanguageCode() },
    });
    return response.data;
};

// Filter movies by genre, year, and country from backend
export const filterMoviesFromBackend = async (
    genreIds?: string,
    year?: number,
    country?: string,
    page: number = 1
): Promise<ApiResponse<Movie>> => {
    const params: any = { page, language: getTmdbLanguageCode() };

    if (genreIds) params.genreIds = genreIds;
    if (year) params.year = year;
    if (country) params.country = country;

    const response = await backendApi.get('/public/movies/filter', {
        params,
    });
    return response.data;
};

// ======================================
// Backend API Endpoints (Comment & Rate)
// Lấy review của phim (comment và rate từ phía DB và TMDB)
// Đăng bài review mới và ghi vào DB
// ======================================
export const getMovieReviews = async (
    movieId: number,
    page: number = 1
): Promise<ApiResponse<Review>> => {

    const response = await backendApi.get(`/public/movies/${movieId}/reviews`, {
        params: { page }
    });

    return response.data;
};

export const createReview = async (
    movieId: number,
    data: { comment: string; rating: number }
) => {
    const response = await backendApi.post(
        `/movies/${movieId}/reviews`,
        data
    );

    return response.data;
};

export const getMyReviews = async () => {
    const res = await backendApi.get('/reviews/me');
    return res.data;
};

// ======================================
// TMDB API Endpoints (Actor & Company Details)
// Lấy thông tin chi tiết của Diễn viên & Hãng phim sản xuất từ TMDB
// ======================================


// ======================================
// Backend API Endpoints (Playlist)
// Tạo playlist riêng của bản thân bằng nút [Add to playlist] ở trang MovieDetail
// ======================================
export const createPlaylist = (name: string) =>
    backendApi.post('/playlists', { name }).then(res => res.data);

export const toggleMovieInPlaylist = (playlistId: number, movieId: number) =>
    backendApi.post(`/playlists/${playlistId}/toggle`, null, {
        params: { movieId }
    }).then(res => res.data);

export const getPlaylists = (movieId: number) =>
    backendApi.get('/playlists', {
        params: { movieId }
    }).then(res => res.data);

export const getPlaylistMovies = (playlistId: number) =>
    backendApi.get(`/playlists/${playlistId}/movies`).then(res => res.data);
