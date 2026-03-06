import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestPasswordReset, verifyResetCode, resetPassword } from '../../api/password';
import backgroundImage from '../../assets/background_login.webp';

type Step = 'email' | 'verify' | 'reset' | 'success';

const ForgotPassword: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<Step>('email');
    const [isLoading, setIsLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [resetCode, setResetCode] = useState(['', '', '', '', '', '']);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [successMessage, setSuccessMessage] = useState('');

    // Step 1: Email validation
    const validateEmail = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Email is invalid';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle request reset
    const handleRequestReset = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateEmail()) return;

        setIsLoading(true);
        try {
            await requestPasswordReset({ email });
            setStep('verify');
            setErrors({});
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to request password reset';
            setErrors({ email: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle code input change
    const handleCodeChange = (index: number, value: string) => {
        if (value.length > 1) return;
        const newCode = [...resetCode];
        newCode[index] = value;
        setResetCode(newCode);

        // Auto focus to next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`code-${index + 1}`) as HTMLInputElement;
            nextInput?.focus();
        }
    };

    // Handle code backspace
    const handleCodeKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !resetCode[index] && index > 0) {
            const prevInput = document.getElementById(`code-${index - 1}`) as HTMLInputElement;
            prevInput?.focus();
        }
    };

    // Validate and verify code
    const handleVerifyCode = async (e: React.FormEvent) => {
        e.preventDefault();
        const code = resetCode.join('');
        if (code.length !== 6) {
            setErrors({ code: 'Please enter all 6 digits' });
            return;
        }

        setIsLoading(true);
        try {
            await verifyResetCode({ email, code });
            setStep('reset');
            setErrors({});
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Invalid verification code';
            setErrors({ code: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    // Validate reset password
    const validatePassword = (): boolean => {
        const newErrors: { [key: string]: string } = {};
        if (!newPassword) {
            newErrors.password = 'Password is required';
        } else if (newPassword.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle reset password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePassword()) return;

        const code = resetCode.join('');
        setIsLoading(true);
        try {
            await resetPassword({ email, code, newPassword });
            setSuccessMessage('Password has been reset successfully!');
            setStep('success');
            setErrors({});
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Failed to reset password';
            setErrors({ password: errorMsg });
        } finally {
            setIsLoading(false);
        }
    };

    // Handle redirect to login
    const handleRedirectToLogin = () => {
        navigate('/login');
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

            {/* Modal */}
            <div className="relative w-full max-w-md mx-4 bg-white rounded-lg shadow-2xl p-8">
                {/* Back Button */}
                {step !== 'success' && (
                    <button
                        onClick={() => {
                            if (step === 'verify') {
                                setStep('email');
                                setResetCode(['', '', '', '', '', '']);
                            } else if (step === 'reset') {
                                setStep('verify');
                            } else if (step === 'email') {
                                navigate('/login');
                            }
                        }}
                        className="mb-4 inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 transition"
                    >
                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                    </button>
                )}

                {/* Step 1: Forgot Password */}
                {step === 'email' && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Forgot password</h1>
                        <p className="text-gray-600 text-sm mb-6">Please enter your email to reset the password</p>

                        <form onSubmit={handleRequestReset} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Your Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        if (errors.email) setErrors({});
                                    }}
                                    placeholder="Enter your email"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-lg font-semibold transition ${isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isLoading ? 'Sending...' : 'Reset Password'}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 2: Verify Email */}
                {step === 'verify' && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Check your email</h1>
                        <p className="text-gray-600 text-sm mb-2">We sent a reset link to {email}</p>
                        <p className="text-gray-600 text-sm mb-6">enter 6 digit code that mentioned in the email</p>

                        <form onSubmit={handleVerifyCode} className="space-y-4">
                            <div>
                                <div className="flex gap-2 mb-4">
                                    {resetCode.map((digit, index) => (
                                        <input
                                            key={index}
                                            id={`code-${index}`}
                                            type="text"
                                            inputMode="numeric"
                                            maxLength={1}
                                            value={digit}
                                            onChange={(e) => handleCodeChange(index, e.target.value)}
                                            onKeyDown={(e) => handleCodeKeyDown(index, e)}
                                            className={`w-12 h-12 text-center border-2 rounded-lg font-bold text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${errors.code ? 'border-red-500' : 'border-gray-300'
                                                }`}
                                        />
                                    ))}
                                </div>
                                {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-lg font-semibold transition ${isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Code'}
                            </button>

                            <p className="text-center text-sm text-gray-600">
                                Haven't got the email yet?{' '}
                                <button
                                    type="button"
                                    onClick={handleRequestReset}
                                    className="text-blue-600 hover:underline font-semibold"
                                >
                                    Resend email
                                </button>
                            </p>
                        </form>
                    </>
                )}

                {/* Step 3: Set New Password */}
                {step === 'reset' && (
                    <>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Set a new password</h1>
                        <p className="text-gray-600 text-sm mb-6">
                            Create a new password. Ensure it differs from previous ones for security
                        </p>

                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        {showPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        if (errors.password) setErrors({});
                                    }}
                                    placeholder="Enter your new password"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="text-sm text-blue-600 hover:text-blue-700"
                                    >
                                        {showConfirmPassword ? 'Hide' : 'Show'}
                                    </button>
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        if (errors.confirmPassword) setErrors({});
                                    }}
                                    placeholder="Re-enter password"
                                    className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition text-gray-900 placeholder:text-gray-400 ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 rounded-lg font-semibold transition ${isLoading
                                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                    : 'bg-blue-500 text-white hover:bg-blue-600'
                                    }`}
                            >
                                {isLoading ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </>
                )}

                {/* Step 4: Success */}
                {step === 'success' && (
                    <div className="flex flex-col items-center justify-center py-12">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-2">Password reset</h1>
                        <p className="text-gray-600 text-sm text-center mb-8">
                            Your password has been successfully reset. Click below to set a new password
                        </p>

                        <button
                            onClick={handleRedirectToLogin}
                            className="w-full py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition"
                        >
                            Confirm
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;
