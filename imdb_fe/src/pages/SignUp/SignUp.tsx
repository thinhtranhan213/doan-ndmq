import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signUpUser } from '../../api/auth';
import { useAuthStore } from '../../store/authStore';
import backgroundImage from '../../assets/background_login.webp';

const SignUp: React.FC = () => {
    const navigate = useNavigate();
    const { login, setError, setLoading } = useAuthStore();
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState<{
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
        passwordConfirm?: string;
    }>({});

    // Form states
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        passwordConfirm: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error for this field
        if (errors[name as keyof typeof errors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    // Validate form
    const validateForm = (): boolean => {
        const newErrors: typeof errors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        } else if (!/(?=.*[a-z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one lowercase letter';
        } else if (!/(?=.*[A-Z])/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one uppercase letter';
        } else if (!/(?=.*\d)/.test(formData.password)) {
            newErrors.password = 'Password must contain at least one number';
        }

        if (!formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Please confirm password';
        } else if (formData.password !== formData.passwordConfirm) {
            newErrors.passwordConfirm = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle sign up
    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        setLoading(true);
        setError(null);

        try {
            const response = await signUpUser({
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
                password: formData.password,
            });

            login(response);
            navigate('/');
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || 'Sign up failed. Please try again.';
            setError(errorMessage);
            setErrors({ email: errorMessage });
        } finally {
            setIsLoading(false);
            setLoading(false);
        }
    };

    // Handle social login (placeholder)
    const handleSocialSignUp = (provider: string) => {
        console.log(`Sign up with ${provider}`);
        // TODO: Implement social login
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-cover bg-center"
            style={{
                backgroundImage: `url(${backgroundImage})`,
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>

            {/* Sign Up Modal */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-8">
                {/* Close button */}
                <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition">
                    ✕
                </button>

                {/* Header */}
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Sign up</h1>

                {/* Social Sign Up Buttons */}
                <div className="space-y-3 mb-6">
                    <button
                        onClick={() => handleSocialSignUp('facebook')}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 rounded-full py-3 hover:bg-gray-50 transition font-semibold text-gray-700"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                fill="#1877F2"
                                d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            />
                        </svg>
                        Sign up with Facebook
                    </button>

                    <button
                        onClick={() => handleSocialSignUp('google')}
                        className="w-full flex items-center justify-center gap-2 border-2 border-gray-300 rounded-full py-3 hover:bg-gray-50 transition font-semibold text-gray-700"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                            <path
                                fill="#4285F4"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Sign up with Google
                    </button>
                </div>

                {/* Divider */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-gray-500 text-sm font-semibold">OR</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Form */}
                <form onSubmit={handleSignUp} className="space-y-4">
                    {/* Name Fields Row */}
                    <div className="grid grid-cols-2 gap-4">
                        {/* First Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                placeholder="John"
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 ${errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>}
                        </div>

                        {/* Last Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                placeholder="Doe"
                                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 ${errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>}
                        </div>
                    </div>

                    {/* Email Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="example@email.com"
                            className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                }`}
                        />
                        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                    </div>

                    {/* Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="At least 8 characters with uppercase, lowercase, and number"
                                className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 text-sm ${errors.password ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                    </div>

                    {/* Confirm Password Field */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showPasswordConfirm ? 'text' : 'password'}
                                name="passwordConfirm"
                                value={formData.passwordConfirm}
                                onChange={handleInputChange}
                                placeholder="Re-enter your password"
                                className={`w-full px-4 py-3 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 text-sm ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                            >
                                {showPasswordConfirm ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm}</p>}
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`w-full py-3 rounded-full font-semibold transition ${isLoading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-gray-400 to-gray-500 text-white hover:from-gray-500 hover:to-gray-600'
                            }`}
                    >
                        {isLoading ? 'Signing up...' : 'Sign up'}
                    </button>
                </form>

                {/* Login Link */}
                <p className="text-center text-sm text-gray-600 mt-6">
                    Already have an account?{' '}
                    <Link to="/login" className="text-blue-600 hover:underline font-semibold">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
