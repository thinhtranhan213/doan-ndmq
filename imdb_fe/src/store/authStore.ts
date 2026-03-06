import { create } from 'zustand';
import { LoginResponse, isAuthenticated, getCurrentUser } from '../api/auth';

export interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    // Actions
    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    login: (response: LoginResponse) => void;
    logout: () => void;
    initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,

    setUser: (user) => set({ user }),
    setToken: (token) => set({ token }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error }),

    login: (response) => {
        const { token, user } = response;
        localStorage.setItem('authToken', token);
        localStorage.setItem('user', JSON.stringify(user));
        set({
            user,
            token,
            isAuthenticated: true,
            error: null,
        });
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        set({
            user: null,
            token: null,
            isAuthenticated: false,
            error: null,
        });
    },

    initializeAuth: () => {
        const token = localStorage.getItem('authToken');
        const user = getCurrentUser();
        if (token && user) {
            set({
                user,
                token,
                isAuthenticated: true,
            });
        }
    },
}));
