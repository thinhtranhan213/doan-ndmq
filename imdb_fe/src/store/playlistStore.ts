import { create } from 'zustand';
import { createPlaylist, toggleMovieInPlaylist, getPlaylists, getPlaylistMovies } from '../api/endpoints';

interface PlaylistData {
    id: number | null;
    movieIds: Set<number>;
}

interface PlaylistStoreState {
    // Favorites (My Watchlist)
    favorites: PlaylistData;
    // Recently Viewed
    recentlyViewed: PlaylistData;
    // Watch Later
    watchLater: PlaylistData;

    loading: boolean;
    error: string | null;

    // Actions
    initializePlaylists: () => Promise<void>;
    loadPlaylistMovies: (playlistType: 'favorites' | 'recentlyViewed' | 'watchLater') => Promise<void>;
    toggleMovieInPlaylist: (playlistType: 'favorites' | 'recentlyViewed' | 'watchLater', movieId: number) => Promise<void>;
    isInPlaylist: (playlistType: 'favorites' | 'recentlyViewed' | 'watchLater', movieId: number) => boolean;
    setError: (error: string | null) => void;
}

const PLAYLIST_NAMES = {
    favorites: 'My Watchlist',
    recentlyViewed: 'Recently Viewed',
    watchLater: 'Watch Later'
};

export const usePlaylistStore = create<PlaylistStoreState>((set, get) => ({
    favorites: { id: null, movieIds: new Set() },
    recentlyViewed: { id: null, movieIds: new Set() },
    watchLater: { id: null, movieIds: new Set() },
    loading: false,
    error: null,

    initializePlaylists: async () => {
        try {
            set({ loading: true, error: null });
            console.log('Initializing playlists...');

            const playlists = await getPlaylists(0) as any[];
            console.log('Playlists fetched:', playlists);

            // Initialize each playlist
            const playlistTypes = ['favorites', 'recentlyViewed', 'watchLater'] as const;

            for (const type of playlistTypes) {
                const name = PLAYLIST_NAMES[type];
                let playlist = playlists.find((p) => p.name === name);

                if (!playlist) {
                    console.log(`${name} not found, creating new one...`);
                    playlist = await createPlaylist(name) as any;
                }

                set(state => ({
                    [type]: { ...state[type], id: playlist.id }
                }));

                await get().loadPlaylistMovies(type);
            }

            console.log('All playlists initialized successfully');
        } catch (error) {
            console.error('Error initializing playlists:', error);
            set({ error: 'Failed to initialize playlists' });
        } finally {
            set({ loading: false });
        }
    },

    loadPlaylistMovies: async (playlistType: 'favorites' | 'recentlyViewed' | 'watchLater') => {
        const playlist = get()[playlistType];

        if (!playlist.id) {
            console.warn(`${playlistType} ID not set`);
            return;
        }

        try {
            const movieData = await getPlaylistMovies(playlist.id) as any[];
            const movieIds = new Set(movieData.map((item: any) => item.movieId));

            set(state => ({
                [playlistType]: { id: playlist.id, movieIds }
            }));
        } catch (error) {
            console.error(`Error loading ${playlistType} movies:`, error);
        }
    },

    toggleMovieInPlaylist: async (playlistType: 'favorites' | 'recentlyViewed' | 'watchLater', movieId: number) => {
        let playlist = get()[playlistType];

        // Auto-initialize playlists if not already initialized
        if (!playlist.id) {
            console.warn(`${playlistType} not initialized, initializing playlists...`);
            await get().initializePlaylists();
            playlist = get()[playlistType];
        }

        if (!playlist.id) {
            console.error(`${playlistType} ID still not set after initialization`);
            set({ error: `${playlistType} not initialized` });
            throw new Error(`${playlistType} not initialized`);
        }

        try {
            set({ loading: true, error: null });
            console.log(`Toggling movie ${movieId} in ${playlistType}`);

            await toggleMovieInPlaylist(playlist.id, movieId);
            await get().loadPlaylistMovies(playlistType);
            console.log(`Successfully toggled movie ${movieId} in ${playlistType}`);
        } catch (error) {
            console.error(`Error toggling movie in ${playlistType}:`, error);
            set({ error: `Failed to update ${playlistType}` });
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    isInPlaylist: (playlistType: 'favorites' | 'recentlyViewed' | 'watchLater', movieId: number) => {
        return get()[playlistType].movieIds.has(movieId);
    },

    setError: (error: string | null) => set({ error }),
}));
