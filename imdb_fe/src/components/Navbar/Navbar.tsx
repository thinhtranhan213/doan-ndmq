
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SearchBar from '../SearchBar/SearchBar';
import { useAuthStore } from '../../store/authStore';

interface Genre {
    id: number;
    name: string;
    emoji: string;
}

const Navbar: React.FC = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { user, logout } = useAuthStore();
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const userDropdownRef = useRef<HTMLDivElement>(null);

    const genres: Genre[] = [
        { id: 28, name: t('genres.Action'), emoji: '🎬' },
        { id: 35, name: t('genres.Comedy'), emoji: '😂' },
        { id: 18, name: t('genres.Drama'), emoji: '🎭' },
        { id: 27, name: t('genres.Horror'), emoji: '👻' },
        { id: 878, name: t('genres.ScienceFiction'), emoji: '🚀' },
        { id: 53, name: t('genres.Thriller'), emoji: '🔪' },
        { id: 10749, name: t('genres.Romance'), emoji: '💕' },
        { id: 16, name: t('genres.Animation'), emoji: '🎨' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsGenreDropdownOpen(false);
            }
            if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
                setIsUserDropdownOpen(false);
            }
        };

        if (isGenreDropdownOpen || isUserDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isGenreDropdownOpen, isUserDropdownOpen]);

    const toggleGenreDropdown = () => {
        setIsGenreDropdownOpen(!isGenreDropdownOpen);
    };

    const closeDropdown = () => {
        setIsGenreDropdownOpen(false);
    };

    const toggleUserDropdown = () => {
        setIsUserDropdownOpen(!isUserDropdownOpen);
    };

    const handleLogout = () => {
        logout();
        setIsUserDropdownOpen(false);
        navigate('/login');
    };

    const handleProfileClick = () => {
        setIsUserDropdownOpen(false);
        navigate('/profile');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 bg-slate-900 border-b border-slate-700 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0 flex items-center">
                        <div className="bg-imdb-yellow text-white font-bold px-2 py-1 rounded text-xl">
                            IMDb
                        </div>
                    </Link>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center gap-8 ml-8">
                        <NavLink
                            to="/"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-imdb-yellow font-semibold px-4'
                                    : 'text-white hover:text-imdb-yellow transition px-4'
                            }
                        >
                            {t('navbar.home')}
                        </NavLink>

                        {/* Genres Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleGenreDropdown}
                                className="flex items-center gap-2 text-white hover:text-imdb-yellow transition px-4 py-2 cursor-pointer"
                            >
                                <span>{t('navbar.genres')}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isGenreDropdownOpen ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* Dropdown Menu */}
                            {isGenreDropdownOpen && (
                                <div className="absolute top-full left-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                                    <div className="py-2">
                                        {genres.map((genre) => (
                                            <Link
                                                key={genre.id}
                                                to={`/genre/${genre.id}`}
                                                onClick={closeDropdown}
                                                className="flex items-center gap-3 px-4 py-3 text-white hover:bg-slate-700 hover:text-imdb-yellow transition-colors"
                                            >
                                                <span className="text-xl">{genre.emoji}</span>
                                                <span className="font-medium">{genre.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        <NavLink
                            to="/search"
                            className={({ isActive }) =>
                                isActive
                                    ? 'text-imdb-yellow font-semibold px-4'
                                    : 'text-white hover:text-imdb-yellow transition px-4'
                            }
                        >
                            {t('common.search')}
                        </NavLink>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl ml-auto">
                        <SearchBar />
                    </div>

                    {/* User Account Dropdown or Login/Signup Buttons */}
                    {user ? (
                        // Authenticated: Show user profile dropdown
                        <div className="relative ml-4" ref={userDropdownRef}>
                            <button
                                onClick={toggleUserDropdown}
                                className="flex items-center gap-2 text-white hover:text-imdb-yellow transition px-4 py-2 rounded hover:bg-slate-800"
                            >
                                <svg
                                    className="w-5 h-5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                    />
                                </svg>
                                <span className="text-sm font-medium">{user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email}</span>
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? 'rotate-180' : ''}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M19 9l-7 7-7-7"
                                    />
                                </svg>
                            </button>

                            {/* User Dropdown Menu */}
                            {isUserDropdownOpen && (
                                <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl overflow-hidden animate-fadeIn">
                                    <div className="py-2">
                                        <button
                                            onClick={handleProfileClick}
                                            className="w-full text-left px-4 py-3 text-white hover:bg-slate-700 hover:text-imdb-yellow transition-colors flex items-center gap-2"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                                />
                                            </svg>
                                            <span>{t('profile.profile')}</span>
                                        </button>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-white hover:bg-slate-700 hover:text-red-400 transition-colors flex items-center gap-2 border-t border-slate-700"
                                        >
                                            <svg
                                                className="w-4 h-4"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                />
                                            </svg>
                                            <span>{t('navbar.logout')}</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ) : (
                        // Not authenticated: Show login and signup buttons
                        <div className="flex items-center gap-2 ml-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-white hover:text-imdb-yellow transition font-medium"
                            >
                                {t('navbar.login')}
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-imdb-yellow text-slate-900 hover:bg-yellow-400 transition font-semibold rounded"
                            >
                                {t('navbar.signup')}
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Add fadeIn animation to index.css if not exists */}
            <style>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.2s ease-out;
                }
            `}</style>
        </nav>
    );
};

export default Navbar;
