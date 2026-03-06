import axios from 'axios';

// API base URL - thay đổi theo backend URL của bạn
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

// ========== FAKE DATA FOR DEMO ==========
const FAKE_USERS = [
    {
        id: '1',
        email: 'demo@example.com',
        password: 'demo123',
        name: 'Demo User'
    },
    {
        id: '2',
        email: 'admin@example.com',
        password: 'admin123',
        name: 'Admin User'
    },
    {
        id: '3',
        email: 'john@example.com',
        password: 'john123',
        name: 'John Doe'
    }
];

const generateFakeToken = (userId: string): string => {
    return `fake_token_${userId}_${Date.now()}`;
};

const ENABLE_MOCK_API = true; // Set to false khi dùng backend thực sự
// =========================================

const authApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mock API Interceptor cho development - MUST RUN BEFORE REQUEST
if (ENABLE_MOCK_API) {
    authApi.interceptors.request.use(
        async (config) => {
            // Mock login
            if (config.url === '/auth/login' && config.method === 'post') {
                const { email, password } = config.data;
                console.log('[MOCK API] Login attempt:', email);

                const user = FAKE_USERS.find(u => u.email === email && u.password === password);

                if (user) {
                    // Simulate network delay
                    await new Promise(resolve => setTimeout(resolve, 500));

                    console.log('[MOCK API] Login success for:', email);
                    // Resolve the request immediately with mock data
                    return Promise.reject({
                        config,
                        response: {
                            status: 200,
                            data: {
                                token: generateFakeToken(user.id),
                                user: {
                                    id: user.id,
                                    email: user.email,
                                    name: user.name
                                }
                            }
                        },
                        isMockSuccess: true
                    });
                } else {
                    console.log('[MOCK API] Login failed for:', email);
                    return Promise.reject({
                        config,
                        response: {
                            status: 401,
                            data: { message: 'Email hoặc mật khẩu không chính xác' }
                        }
                    });
                }
            }

            // Mock signup
            if (config.url === '/auth/signup' && config.method === 'post') {
                const { email, firstName, lastName } = config.data;
                const newUser = {
                    id: String(FAKE_USERS.length + 1),
                    email,
                    password: 'password123',
                    name: `${firstName} ${lastName}`
                };

                await new Promise(resolve => setTimeout(resolve, 500));

                return Promise.reject({
                    config,
                    response: {
                        status: 200,
                        data: {
                            token: generateFakeToken(newUser.id),
                            user: {
                                id: newUser.id,
                                email: newUser.email,
                                name: newUser.name
                            }
                        }
                    },
                    isMockSuccess: true
                });
            }

            // For non-mock requests, continue normally
            return config;
        },
        (error) => Promise.reject(error)
    );
}

// Response interceptor to handle mock success responses
authApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        // Handle mock API success responses
        if (error.isMockSuccess) {
            return Promise.resolve({
                status: error.response.status,
                data: error.response.data,
                config: error.config,
                headers: {}
            });
        }

        // Thêm token vào header khi gửi request (cho real requests)
        if (!error.config?.headers?.Authorization) {
            const token = localStorage.getItem('authToken');
            if (token && error.config) {
                error.config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return Promise.reject(error);
    }
);

// Add token to header for regular requests
authApi.interceptors.request.use(
    (config) => {
        // Skip if already handled by mock
        if (!ENABLE_MOCK_API || (config.url !== '/auth/login' && config.url !== '/auth/signup')) {
            const token = localStorage.getItem('authToken');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
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
