import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { changePassword } from '../../api/auth';

interface PasswordChangeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    hasPassword: boolean;
}

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
    isOpen,
    onClose,
    onSuccess,
    hasPassword
}) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showPasswords, setShowPasswords] = useState({
        old: false,
        new: false,
        confirm: false
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        // Validation
        if (!hasPassword && !formData.oldPassword) {
            // If user has no password (OAuth2), oldPassword can be empty
        } else if (hasPassword && !formData.oldPassword) {
            setError(t('auth.currentPasswordRequired'));
            return;
        }

        if (!formData.newPassword) {
            setError(t('auth.passwordRequired'));
            return;
        }

        if (formData.newPassword.length < 8) {
            setError(t('auth.passwordMinLength'));
            return;
        }

        if (!/(?=.*[a-z])/.test(formData.newPassword)) {
            setError(t('auth.passwordLowercase'));
            return;
        }

        if (!/(?=.*[A-Z])/.test(formData.newPassword)) {
            setError(t('auth.passwordUppercase'));
            return;
        }

        if (!/(?=.*\d)/.test(formData.newPassword)) {
            setError(t('auth.passwordNumber'));
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setError(t('auth.passwordNotMatch'));
            return;
        }

        if (hasPassword && formData.oldPassword === formData.newPassword) {
            setError(t('auth.newPasswordDifferent'));
            return;
        }

        try {
            setLoading(true);
            await changePassword({
                oldPassword: formData.oldPassword,
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword
            });

            setFormData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            onSuccess();
            onClose();
        } catch (err: any) {
            setError(err.response?.data?.message || t('auth.passwordChangeFailed'));
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 w-full max-w-md">
                <h2 className="text-2xl font-bold text-white mb-6">
                    {hasPassword ? t('Đổi Mật Khẩu') : t('Tạo Mật Khẩu')}
                </h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-900 border border-red-700 rounded text-red-200 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Old Password - Only show if has password */}
                    {hasPassword && (
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                {t('auth.currentPassword')}
                            </label>
                            <div className="relative">
                                <input
                                    type={showPasswords.old ? 'text' : 'password'}
                                    name="oldPassword"
                                    value={formData.oldPassword}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-imdb-yellow placeholder-slate-500"
                                    placeholder={t('auth.enterCurrentPassword')}
                                    disabled={loading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswords(prev => ({ ...prev, old: !prev.old }))}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                                >
                                    {showPasswords.old ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            {hasPassword ? t('auth.newPassword') : t('auth.password')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? 'text' : 'password'}
                                name="newPassword"
                                value={formData.newPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-imdb-yellow placeholder-slate-500"
                                placeholder={t('auth.enterNewPassword')}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showPasswords.new ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                        <p className="text-xs text-slate-400 mt-2">
                            {t('auth.passwordRequirements')}
                        </p>
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-2">
                            {t('auth.confirmPassword')}
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.confirm ? 'text' : 'password'}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-imdb-yellow placeholder-slate-500"
                                placeholder={t('auth.confirmNewPassword')}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white"
                            >
                                {showPasswords.confirm ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={loading}
                            className="flex-1 px-4 py-2 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors disabled:opacity-50"
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 px-4 py-2 bg-imdb-yellow text-slate-900 font-semibold rounded hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? t('common.saving') : hasPassword ? t('auth.updatePassword') : t('auth.setPassword')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PasswordChangeModal;
