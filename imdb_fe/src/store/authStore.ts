import { create } from 'zustand';
import { getCurrentUser, getCurrentUserProfile, LoginResponse, User } from '../api/auth';

interface AuthState {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    error: string | null;
    isAuthenticated: boolean;

    setUser: (user: User | null) => void;
    setToken: (token: string | null) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    login: (response: LoginResponse) => void;
    logout: () => void;
    initializeAuth: () => void;
}

/** Ghi user (kèm roles) vào localStorage và Zustand */
const persistUser = (user: User, token: string, set: (partial: Partial<AuthState>) => void) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('user', JSON.stringify(user));
    set({ user, token, isAuthenticated: true, error: null });
};

/** Lấy roles mới nhất từ /api/user/me, cập nhật store + localStorage */
const syncRoles = (storedUser: User, token: string, set: (partial: Partial<AuthState>) => void) => {
    getCurrentUserProfile()
        .then((profile) => {
            const fresh: User = { ...storedUser, roles: profile.user.roles ?? [] };
            localStorage.setItem('user', JSON.stringify(fresh));
            set({ user: fresh });
        })
        .catch(() => {
            // Token hết hạn hoặc không hợp lệ → xoá session
            localStorage.removeItem('authToken');
            localStorage.removeItem('user');
            set({ user: null, token: null, isAuthenticated: false });
        });
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,

    setUser:    (user)    => set({ user }),
    setToken:   (token)   => set({ token }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError:   (error)   => set({ error }),

    login: (response: LoginResponse) => {
        const { accessToken, userName, email, firstName, lastName, roles } = response;
        const user: User = { email, userName, firstName, lastName, roles: roles ?? [] };
        persistUser(user, accessToken, set);

        // OAuth2 login không truyền roles qua URL → fetch lại ngay
        if (!roles || roles.length === 0) {
            syncRoles(user, accessToken, set);
        }
    },

    logout: () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, error: null });
    },

    initializeAuth: () => {
        const token = localStorage.getItem('authToken');
        const storedUser = getCurrentUser();
        if (!token || !storedUser) return;

        // Restore ngay từ localStorage để không block UI
        set({ user: storedUser, token, isAuthenticated: true });

        // Luôn đồng bộ roles từ backend (cover session cũ + OAuth2)
        syncRoles(storedUser, token, set);
    },
}));