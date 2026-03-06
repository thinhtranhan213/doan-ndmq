
import { create } from 'zustand';
import { Movie, MovieDetail } from '../types/movie.types';

interface MovieState {
    movies: Movie[];
    currentMovie: MovieDetail | null;
    loading: boolean;
    error: string | null;
    setMovies: (movies: Movie[]) => void;
    addMovies: (movies: Movie[]) => void;
    setCurrentMovie: (movie: MovieDetail | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    clearError: () => void;
}

export const useMovieStore = create<MovieState>((set) => ({
    movies: [],
    currentMovie: null,
    loading: false,
    error: null,
    setMovies: (movies) => set({ movies }),
    addMovies: (newMovies) =>
        set((state) => ({
            movies: [...state.movies, ...newMovies].slice(0, 50),
        })),
    setCurrentMovie: (movie) => set({ currentMovie: movie }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
    clearError: () => set({ error: null }),
}));
