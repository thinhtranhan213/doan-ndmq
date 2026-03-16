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

const ENABLE_MOCK_API = false; // Set to false khi dùng backend thực sự
// =========================================

// OAuth2 Configuration
export const OAUTH2_GOOGLE_URL = 'http://localhost:8080/oauth2/authorization/google';

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
                                accessToken: generateFakeToken(user.id),
                                userName: user.email,
                                email: user.email,
                                firstName: 'Demo',
                                lastName: 'User',
                                roles: ['ROLE_USER']
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
            if (config.url === '/auth/register' && config.method === 'post') {
                const { email, firstName, lastName } = config.data;

                await new Promise(resolve => setTimeout(resolve, 500));

                return Promise.reject({
                    config,
                    response: {
                        status: 200,
                        data: {
                            accessToken: generateFakeToken(String(FAKE_USERS.length + 1)),
                            userName: email,
                            email: email,
                            firstName: firstName,
                            lastName: lastName,
                            roles: ['ROLE_USER']
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
        if (!ENABLE_MOCK_API || (config.url !== '/auth/login' && config.url !== '/auth/register')) {
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

export interface User {
    email: string;
    userName: string;
    firstName: string;
    lastName: string;
}

export interface LoginResponse {
    accessToken: string;
    userName: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
}

export interface ProfileResponse {
    user: {
        email: string;
        firstName: string;
        lastName: string;
        createdAt: string;
        roles: string[];
        hasPassword?: boolean;
        provider?: string;
    };
}

export interface SignUpRequest {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
}

// Login API
export const loginUser = async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await authApi.post<LoginResponse>('/auth/login', credentials);
    return response.data;
};

// Sign up API
export const signUpUser = async (data: SignUpRequest): Promise<LoginResponse> => {
    const response = await authApi.post<LoginResponse>('/auth/register', data);
    return response.data;
};

// Logout
export const logoutUser = (): void => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
};

// Lấy user hiện tại
export const getCurrentUser = (): User | null => {
    const user = localStorage.getItem('user');
    if (!user || user === 'undefined') {
        return null;
    }
    try {
        return JSON.parse(user);
    } catch {
        return null;
    }
};

// Check token hợp lệ
export const isAuthenticated = (): boolean => {
    return !!localStorage.getItem('authToken');
};

// Handle OAuth2 login success callback
export const handleOAuth2Callback = (token: string, userData?: { userName?: string; email?: string; firstName?: string; lastName?: string; roles?: string[] }): LoginResponse | null => {
    localStorage.setItem('authToken', token);

    // If user data is provided, save it
    if (userData?.email) {
        const user: User = {
            email: userData.email,
            userName: userData.userName || userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
        };
        localStorage.setItem('user', JSON.stringify(user));
        return {
            accessToken: token,
            userName: userData.userName || userData.email,
            email: userData.email,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            roles: userData.roles || []
        };
    }

    // Try to get user from localStorage
    const user = getCurrentUser();
    if (user) {
        return {
            accessToken: token,
            userName: user.userName,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            roles: []
        };
    }

    return null;
};

// Initiate Google OAuth2 login
export const loginWithGoogle = (): void => {
    window.location.href = OAUTH2_GOOGLE_URL;
};

// Get current user profile
export const getCurrentUserProfile = async (): Promise<ProfileResponse> => {
    const response = await authApi.get<ProfileResponse>('/user/me');
    return response.data;
};

// Change password
export interface ChangePasswordRequest {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export const changePassword = async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await authApi.put('/user/change-password', {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
        confirmPassword: data.confirmPassword
    });
    return response.data;
};

// Update profile
export interface UpdateProfileRequest {
    firstName: string;
    lastName: string;
    email: string;
}

export const updateProfile = async (data: UpdateProfileRequest): Promise<{ message: string }> => {
    const response = await authApi.put('/user/update-profile', {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email
    });
    return response.data;
};
