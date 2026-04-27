import { create } from 'zustand';
import { createPlaylist, toggleMovieInPlaylist, getPlaylists, getPlaylistMovies } from '../api/endpoints';

interface WatchlistState {
    watchlistId: number | null;
    watchlistMovieIds: Set<number>;
    loading: boolean;
    error: string | null;

    // Actions
    initializeWatchlist: () => Promise<void>;
    loadPlaylistMovies: () => Promise<void>;
    toggleMovieInWatchlist: (movieId: number) => Promise<void>;
    isInWatchlist: (movieId: number) => boolean;
    setError: (error: string | null) => void;
}

const WATCHLIST_NAME = 'My Watchlist';

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
    watchlistId: null,
    watchlistMovieIds: new Set(),
    loading: false,
    error: null,

    initializeWatchlist: async () => {
        try {
            set({ loading: true, error: null });

            // Lấy tất cả playlists (truyền movieId bất kỳ để check)
            const playlists = await getPlaylists(0) as any[];

            // Tìm hoặc tạo "My Watchlist"
            let watchlist = playlists.find((p) => p.name === WATCHLIST_NAME);

            if (!watchlist) {
                // Nếu chưa có, tạo mới
                watchlist = await createPlaylist(WATCHLIST_NAME) as any;
            }

            set({ watchlistId: watchlist.id });

            // Load danh sách phim từ playlist
            await get().loadPlaylistMovies();
        } catch (error) {
            console.error('Error initializing watchlist:', error);
            set({ error: 'Failed to initialize watchlist' });
        } finally {
            set({ loading: false });
        }
    },

    loadPlaylistMovies: async () => {
        const { watchlistId } = get();

        if (!watchlistId) {
            console.warn('Watchlist ID not set');
            return;
        }

        try {
            const movieData = await getPlaylistMovies(watchlistId) as any[];
            const movieIds = new Set(movieData.map((item: any) => item.movieId));
            set({ watchlistMovieIds: movieIds });
        } catch (error) {
            console.error('Error loading playlist movies:', error);
        }
    },

    toggleMovieInWatchlist: async (movieId: number) => {
        const { watchlistId } = get();

        if (!watchlistId) {
            set({ error: 'Watchlist not initialized' });
            return;
        }

        try {
            set({ loading: true, error: null });

            await toggleMovieInPlaylist(watchlistId, movieId);

            // Reload danh sách phim từ backend
            await get().loadPlaylistMovies();
        } catch (error) {
            console.error('Error toggling movie in watchlist:', error);
            set({ error: 'Failed to update watchlist' });
        } finally {
            set({ loading: false });
        }
    },

    isInWatchlist: (movieId: number) => {
        return get().watchlistMovieIds.has(movieId);
    },

    setError: (error: string | null) => set({ error }),
}));
