import axios from 'axios';

// API base URL - thay đổi theo backend URL của bạn
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Thêm token vào header khi gửi request
authApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        name: string;
    };
}

export interface SignUpRequest {
    email: string;
    firstName: string;
    lastName: string;
}

// Login API
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
        const response = await authApi.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Sign up API
export const signUpUser = async (data: SignUpRequest): Promise<LoginResponse> => {
    try {
        const response = await authApi.post<LoginResponse>('/auth/signup', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Logout
export const logoutUser = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

// Lấy user hiện tại
export const getCurrentUser = (): any => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

// Check token hợp lệ
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};
