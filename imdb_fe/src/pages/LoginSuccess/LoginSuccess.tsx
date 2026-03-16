import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { handleOAuth2Callback } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';

interface UserInfo {
    id: string;
    email: string;
    name: string;
}

const LoginSuccess: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { login, setError } = useAuthStore();
    const [isProcessing, setIsProcessing] = useState(true);

    useEffect(() => {
        const token = searchParams.get('token');
        const userParam = searchParams.get('user');

        if (!token) {
            setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        try {
            let user: UserInfo | undefined;

            // Decode user info from URL parameter if present
            if (userParam) {
                try {
                    const decoded = decodeURIComponent(userParam);
                    const [id, email, name] = decoded.split('|');
                    user = { id, email, name };
                } catch (e) {
                    console.warn('Failed to decode user info:', e);
                }
            }

            // Handle the OAuth2 callback
            const response = handleOAuth2Callback(token, user);
            if (response) {
                login(response);
            }

            // Redirect to home page
            setTimeout(() => {
                navigate('/');
            }, 1000);
        } catch (error) {
            console.error('Error processing OAuth2 callback:', error);
            setError('Có lỗi xảy ra trong quá trình đăng nhập. Vui lòng thử lại.');
            setTimeout(() => navigate('/login'), 2000);
        } finally {
            setIsProcessing(false);
        }
    }, [searchParams, navigate, login, setError]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
            <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full text-center">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {isProcessing ? 'Đang xử lý đăng nhập...' : 'Đăng nhập thành công!'}
                </h2>

                <div className="flex justify-center mb-4">
                    {isProcessing ? (
                        <div className="w-12 h-12 rounded-full border-4 border-gray-300 border-t-blue-500 animate-spin"></div>
                    ) : (
                        <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    )}
                </div>

                <p className="text-gray-600 mb-2">
                    {isProcessing
                        ? 'Vui lòng chờ trong khi chúng tôi hoàn tất quá trình đăng nhập...'
                        : 'Bạn sẽ được chuyển hướng tới trang chủ ngay...'}
                </p>

                {!isProcessing && (
                    <button
                        onClick={() => navigate('/')}
                        className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition"
                    >
                        Về trang chủ ngay
                    </button>
                )}
            </div>
        </div>
    );
};

export default LoginSuccess;
