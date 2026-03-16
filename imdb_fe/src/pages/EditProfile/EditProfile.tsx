import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { getCurrentUserProfile, ProfileResponse, updateProfile } from '../../api/auth';
import PasswordChangeModal from '../../components/PasswordChangeModal/PasswordChangeModal';

const EditProfile: React.FC = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [userProfile, setUserProfile] = useState<ProfileResponse['user'] | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const profile = await getCurrentUserProfile();
                setUserProfile(profile.user);

                setFormData({
                    firstName: profile.user.firstName || '',
                    lastName: profile.user.lastName || '',
                    email: profile.user.email || ''
                });
            } catch (err) {
                setError('Failed to load profile');
                console.error('Failed to load user profile', err);
            } finally {
                setLoading(false);
            }
        };

        if (isAuthenticated) {
            fetchUserProfile();
        }
    }, [isAuthenticated]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        // Validation
        if (!formData.firstName.trim()) {
            setError('First name is required');
            return;
        }

        try {
            setSaving(true);
            await updateProfile({
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email
            });

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => {
                setSuccessMessage(null);
                navigate('/profile');
            }, 2000);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 pt-20 flex items-center justify-center">
                <div className="text-white">Loading profile...</div>
            </div>
        );
    }

    const hasPassword = userProfile?.hasPassword ?? false;

    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-10">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Edit Profile</h1>
                        <p className="text-slate-400">Update your personal information</p>
                    </div>
                    <button
                        onClick={() => navigate('/profile')}
                        className="px-4 py-2 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors"
                    >
                        Back to Profile
                    </button>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="mb-6 p-4 bg-green-900 border border-green-700 rounded-lg">
                        <p className="text-green-200">{successMessage}</p>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-900 border border-red-700 rounded-lg">
                        <p className="text-red-200">{error}</p>
                    </div>
                )}

                {/* Account Information Card */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-8 mb-8">
                    <h2 className="text-xl font-semibold text-white mb-6">Account Information</h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">First Name</label>
                            <input
                                type="text"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-imdb-yellow placeholder-slate-500 transition-colors"
                                placeholder="Enter first name"
                                disabled={saving}
                            />
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Last Name</label>
                            <input
                                type="text"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-imdb-yellow placeholder-slate-500 transition-colors"
                                placeholder="Enter last name"
                                disabled={saving}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                disabled
                                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded text-slate-500 focus:outline-none placeholder-slate-500 cursor-not-allowed opacity-60"
                                placeholder="Your email (cannot be changed)"
                            />
                            <p className="text-xs text-slate-500 mt-1">Email cannot be changed</p>
                        </div>

                        {/* Form Buttons */}
                        <div className="flex gap-3 pt-6">
                            <button
                                type="button"
                                onClick={() => navigate('/profile')}
                                disabled={saving}
                                className="flex-1 px-6 py-3 border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex-1 px-6 py-3 font-semibold border border-slate-500 text-white rounded hover:bg-slate-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {saving ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Security Card */}
                <div className="bg-slate-900 border border-slate-700 rounded-lg p-8">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-semibold text-white mb-1">Security</h2>
                            <p className="text-slate-400 text-sm">Manage your password settings</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {hasPassword ? (
                            <div className="flex items-center justify-between p-4 bg-slate-800 border border-slate-700 rounded">
                                <div>
                                    <p className="text-white font-medium">Password</p>
                                    <p className="text-slate-400 text-sm">••••••••</p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setIsPasswordModalOpen(true)}
                                    className="px-4 py-2 border border-imdb-yellow text-imdb-yellow rounded hover:bg-slate-900 transition-colors"
                                >
                                    Change
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setIsPasswordModalOpen(true)}
                                className="w-full px-4 py-3 border border-imdb-yellow text-imdb-yellow rounded hover:bg-imdb-yellow hover:text-slate-900 transition-colors"
                            >
                                Set Password
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            <PasswordChangeModal
                isOpen={isPasswordModalOpen}
                onClose={() => setIsPasswordModalOpen(false)}
                onSuccess={() => {
                    setSuccessMessage(hasPassword ? 'Password changed successfully!' : 'Password set successfully!');
                    setTimeout(() => setSuccessMessage(null), 3000);
                }}
                hasPassword={hasPassword}
            />
        </div>
    );
};

export default EditProfile;
