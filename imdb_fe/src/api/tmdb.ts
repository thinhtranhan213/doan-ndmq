import axios, { AxiosInstance, AxiosError } from "axios";

// Create axios instance with base configuration
const tmdbApi: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_TMDB_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
    }
});

// Request interceptor for logging
tmdbApi.interceptors.request.use(
    (config) => {
        console.log('API Request: ', config.url);
        return config;
    },
    (error: AxiosError) => {
        console.error('Request error: ', error);
        return Promise.reject(error);

    }
);

// Response interceptor for error handling
tmdbApi.interceptors.response.use(
    (res) => res,
    (err: AxiosError) => {
        if (err.response) {
            console.error('API error:', err.response.status, err.response.data);

        } else if (err.request) {
            console.error('Network error:', err.request);

        } else {
            console.error('Error:', err.message);

        }
        return Promise.reject(err);
    }
);

export default tmdbApi;

