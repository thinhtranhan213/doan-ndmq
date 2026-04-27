import { create } from 'zustand';
import { getBlacklistedIds } from '../api/adminFilmService';

interface BlacklistState {
    ids: Set<number>;
    loaded: boolean;
    fetchBlacklist: () => Promise<void>;
    isBlacklisted: (id: number) => boolean;
    filterMovies: <T extends { id: number }>(movies: T[]) => T[];
}

export const useBlacklistStore = create<BlacklistState>((set, get) => ({
    ids: new Set(),
    loaded: false,
    fetchBlacklist: async () => {
        try {
            const list = await getBlacklistedIds();
            set({ ids: new Set(list), loaded: true });
        } catch {
            set({ loaded: true });
        }
    },
    isBlacklisted: (id: number) => get().ids.has(id),
    filterMovies: <T extends { id: number }>(movies: T[]) =>
        movies.filter((m) => !get().ids.has(m.id)),
}));