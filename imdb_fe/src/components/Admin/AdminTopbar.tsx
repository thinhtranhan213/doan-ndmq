import React, { useRef, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PAGE_LABELS: Record<string, string> = {
    '/admin/dashboard': 'Tổng quan',
    '/admin/users':     'Quản lý người dùng',
    '/admin/violations':'Xử lý vi phạm',
    '/admin/films':     'Quản lý phim',
    '/admin/reviews':   'Quản lý đánh giá',
    '/admin/reports':   'Báo cáo hệ thống',
};

const AdminTopbar: React.FC = () => {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const pageTitle = PAGE_LABELS[location.pathname] ?? 'Admin';
    const initial = user?.firstName?.[0]?.toUpperCase() ?? 'A';

    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="h-14 bg-slate-900 border-b border-slate-700/60 flex items-center justify-between px-6 flex-shrink-0">
            {/* Logo → trang chủ */}
            <div className="flex items-center gap-4">
                <Link to="/" className="flex items-center gap-2 group">
                    <div className="bg-yellow-400 text-black font-black px-2 py-0.5 rounded text-base leading-tight group-hover:bg-yellow-300 transition-colors">
                        IMDb
                    </div>
                </Link>
                <span className="text-slate-600 select-none">/</span>
                <h1 className="text-white font-semibold text-sm">{pageTitle}</h1>
            </div>

            {/* Avatar dropdown */}
            <div className="relative" ref={dropdownRef}>
                <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-black font-bold text-sm">
                        {initial}
                    </div>
                    <span className="text-sm text-gray-300 hidden sm:block">
                        {user?.firstName} {user?.lastName}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {dropdownOpen && (
                    <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50">
                        <Link
                            to="/edit-profile"
                            onClick={() => setDropdownOpen(false)}
                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:bg-slate-700 hover:text-white transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Đổi mật khẩu
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:bg-slate-700 transition-colors border-t border-slate-700"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Đăng xuất
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default AdminTopbar;