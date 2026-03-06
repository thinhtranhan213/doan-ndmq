
import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar';

interface Genre {
    id: number;
    name: string;
    emoji: string;
}

const Navbar: React.FC = () => {
    const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const genres: Genre[] = [
        { id: 28, name: 'Action', emoji: '🎬' },
        { id: 35, name: 'Comedy', emoji: '😂' },
        { id: 18, name: 'Drama', emoji: '🎭' },
        { id: 27, name: 'Horror', emoji: '👻' },
        { id: 878, name: 'Science Fiction', emoji: '🚀' },
        { id: 53, name: 'Thriller', emoji: '🔪' },
        { id: 10749, name: 'Romance', emoji: '💕' },
        { id: 16, name: 'Animation', emoji: '🎨' },
    ];

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsGenreDropdownOpen(false);
            }
        };

        if (isGenreDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isGenreDropdownOpen]);

    const toggleGenreDropdown = () => {
        setIsGenreDropdownOpen(!isGenreDropdownOpen);
    };

    const closeDropdown = () => {
        setIsGenreDropdownOpen(false);
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
                            Home
                        </NavLink>

                        {/* Genres Dropdown */}
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={toggleGenreDropdown}
                                className="flex items-center gap-2 text-white hover:text-imdb-yellow transition px-4 py-2 cursor-pointer"
                            >
                                <span>Genres</span>
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
                            Search
                        </NavLink>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-xl ml-auto">
                        <SearchBar />
                    </div>
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
