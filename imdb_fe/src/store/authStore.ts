import { create } from 'zustand';
import { LoginResponse, getCurrentUser, User } from '../api/auth';

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

    login: (response: LoginResponse) => {
        const { accessToken, userName, email, firstName, lastName } = response;
        const user: User = { email, userName, firstName, lastName };
        localStorage.setItem('authToken', accessToken);
        localStorage.setItem('user', JSON.stringify(user));
        set({
            user,
            token: accessToken,
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
