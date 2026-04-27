import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { getPendingViolationCount } from '../../api/adminStatsService';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    badge?: number;
}

const Icon = ({ d }: { d: string }) => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={d} />
    </svg>
);

const AdminSidebar: React.FC = () => {
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        getPendingViolationCount().then(setPendingCount).catch(() => {});
    }, []);

    const navItems: NavItem[] = [
        {
            path: '/admin/dashboard',
            label: 'Tổng quan',
            icon: <Icon d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
        },
        {
            path: '/admin/users',
            label: 'Người dùng',
            icon: <Icon d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />,
        },
        {
            path: '/admin/violations',
            label: 'Vi phạm',
            icon: <Icon d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />,
            badge: pendingCount,
        },
        {
            path: '/admin/films',
            label: 'Phim',
            icon: <Icon d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />,
        },
        {
            path: '/admin/reviews',
            label: 'Đánh giá',
            icon: <Icon d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />,
        },
        {
            path: '/admin/reports',
            label: 'Báo cáo',
            icon: <Icon d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
        },
    ];

    return (
        <aside className="w-60 bg-slate-900 border-r border-slate-700/60 flex flex-col flex-shrink-0">
            <div className="px-4 py-5 border-b border-slate-700/60">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Admin Panel</p>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive
                                    ? 'bg-yellow-500/15 text-yellow-400'
                                    : 'text-gray-400 hover:bg-slate-800 hover:text-white'
                            }`
                        }
                    >
                        {item.icon}
                        <span className="flex-1">{item.label}</span>
                        {item.badge != null && item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                                {item.badge > 99 ? '99+' : item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default AdminSidebar;