import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

const passwordApi = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyCodeRequest {
    email: string;
    code: string;
}

export interface ResetPasswordRequest {
    email: string;
    code: string;
    newPassword: string;
}

export interface PasswordResponse {
    message: string;
    success: boolean;
}

// Request password reset
export const requestPasswordReset = async (data: ForgotPasswordRequest): Promise<PasswordResponse> => {
    try {
        const response = await passwordApi.post<PasswordResponse>('/auth/forgot-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Verify reset code
export const verifyResetCode = async (data: VerifyCodeRequest): Promise<PasswordResponse> => {
    try {
        const response = await passwordApi.post<PasswordResponse>('/auth/verify-reset-code', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

// Reset password
export const resetPassword = async (data: ResetPasswordRequest): Promise<PasswordResponse> => {
    try {
        const response = await passwordApi.post<PasswordResponse>('/auth/reset-password', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
