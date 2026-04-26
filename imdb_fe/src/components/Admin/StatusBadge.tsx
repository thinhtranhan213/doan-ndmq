import React from 'react';

interface Props { value: string }

const PALETTE: Record<string, string> = {
    ACTIVE:   'bg-green-500/20 text-green-400 border-green-500/30',
    WARNING:  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    BANNED:   'bg-red-500/20 text-red-400 border-red-500/30',
    PUBLIC:   'bg-green-500/20 text-green-400 border-green-500/30',
    HIDDEN:   'bg-slate-500/20 text-slate-400 border-slate-500/30',
    PENDING:  'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    IGNORED:  'bg-slate-500/20 text-slate-400 border-slate-500/30',
    RESOLVED: 'bg-green-500/20 text-green-400 border-green-500/30',
    ROLE_ADMIN: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    ROLE_USER:  'bg-blue-500/20 text-blue-400 border-blue-500/30',
};

const LABEL: Record<string, string> = {
    ACTIVE: 'Hoạt động', WARNING: 'Cảnh báo', BANNED: 'Bị cấm',
    PUBLIC: 'Công khai', HIDDEN: 'Đã ẩn', PENDING: 'Chờ duyệt',
    IGNORED: 'Bỏ qua', RESOLVED: 'Đã xử lý',
    ROLE_ADMIN: 'Admin', ROLE_USER: 'User',
};

const StatusBadge: React.FC<Props> = ({ value }) => {
    const cls = PALETTE[value] ?? 'bg-slate-600/30 text-slate-300 border-slate-600/30';
    return (
        <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${cls}`}>
            {LABEL[value] ?? value}
        </span>
    );
};

export default StatusBadge;