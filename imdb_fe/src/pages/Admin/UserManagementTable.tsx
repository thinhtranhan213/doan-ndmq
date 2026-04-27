import React, { useState } from 'react';
import type { UserAdminDTO, UserStatus, UserRole } from '../../types/admin.types';
import Pagination from '../../components/Pagination/Pagination';

interface Props {
    users: UserAdminDTO[];
    loading: boolean;
    currentPage: number;
    totalPages: number;
    totalElements: number;
    onPageChange: (page: number) => void;
    onStatusChange: (user: UserAdminDTO, status: UserStatus, reason: string) => Promise<void>;
    onRoleChange: (user: UserAdminDTO, role: UserRole) => Promise<void>;
}

interface ConfirmDialog {
    type: 'status' | 'role';
    user: UserAdminDTO;
    newStatus?: UserStatus;
    newRole?: UserRole;
}

const STATUS_LABEL: Record<UserStatus, { label: string; className: string }> = {
    ACTIVE:  { label: 'Hoạt động',  className: 'bg-green-500/20 text-green-400 border border-green-500/30' },
    WARNING: { label: 'Cảnh báo',   className: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' },
    BANNED:  { label: 'Bị cấm',     className: 'bg-red-500/20 text-red-400 border border-red-500/30' },
};

const ROLE_LABEL: Record<UserRole, string> = {
    ROLE_USER:  'User',
    ROLE_ADMIN: 'Admin',
};

const UserManagementTable: React.FC<Props> = ({
    users, loading, currentPage, totalPages, totalElements,
    onPageChange, onStatusChange, onRoleChange,
}) => {
    const [confirm, setConfirm] = useState<ConfirmDialog | null>(null);
    const [reason, setReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    const openStatusDialog = (user: UserAdminDTO, status: UserStatus) => {
        setReason('');
        setConfirm({ type: 'status', user, newStatus: status });
    };

    const openRoleDialog = (user: UserAdminDTO, role: UserRole) => {
        setConfirm({ type: 'role', user, newRole: role });
    };

    const closeDialog = () => {
        setConfirm(null);
        setReason('');
    };

    const handleConfirm = async () => {
        if (!confirm) return;
        setActionLoading(true);
        try {
            if (confirm.type === 'status' && confirm.newStatus) {
                await onStatusChange(confirm.user, confirm.newStatus, reason);
            } else if (confirm.type === 'role' && confirm.newRole) {
                await onRoleChange(confirm.user, confirm.newRole);
            }
            closeDialog();
        } finally {
            setActionLoading(false);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    if (loading) {
        return (
            <div className="flex justify-center items-center py-24">
                <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (users.length === 0) {
        return (
            <div className="text-center py-24 text-gray-400">
                Không tìm thấy người dùng nào.
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto rounded-xl border border-slate-700">
                <table className="w-full text-sm">
                    <thead className="bg-slate-800 text-gray-400 uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 text-left">ID</th>
                            <th className="px-4 py-3 text-left">Tên</th>
                            <th className="px-4 py-3 text-left">Email</th>
                            <th className="px-4 py-3 text-left">Vai trò</th>
                            <th className="px-4 py-3 text-left">Trạng thái</th>
                            <th className="px-4 py-3 text-left">Ngày tạo</th>
                            <th className="px-4 py-3 text-center">Đánh giá</th>
                            <th className="px-4 py-3 text-center">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50">
                        {users.map((user) => {
                            const st = STATUS_LABEL[user.status] ?? STATUS_LABEL.ACTIVE;
                            return (
                                <tr key={user.id} className="bg-slate-900 hover:bg-slate-800/60 transition-colors">
                                    <td className="px-4 py-3 text-gray-400">{user.id}</td>
                                    <td className="px-4 py-3 font-medium text-white">{user.username}</td>
                                    <td className="px-4 py-3 text-gray-300">{user.email}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${user.role === 'ROLE_ADMIN' ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'}`}>
                                            {ROLE_LABEL[user.role]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${st.className}`}>
                                            {st.label}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">{user.createdAt ? formatDate(user.createdAt) : '—'}</td>
                                    <td className="px-4 py-3 text-center text-gray-300">{user.reviewCount}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                            {/* Status actions */}
                                            {user.status !== 'BANNED' && (
                                                <button
                                                    onClick={() => openStatusDialog(user, 'BANNED')}
                                                    className="px-2 py-1 text-xs rounded bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/40 transition-colors"
                                                >
                                                    Ban
                                                </button>
                                            )}
                                            {user.status === 'BANNED' && (
                                                <button
                                                    onClick={() => openStatusDialog(user, 'ACTIVE')}
                                                    className="px-2 py-1 text-xs rounded bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/40 transition-colors"
                                                >
                                                    Unban
                                                </button>
                                            )}
                                            {user.status !== 'WARNING' && user.status !== 'BANNED' && (
                                                <button
                                                    onClick={() => openStatusDialog(user, 'WARNING')}
                                                    className="px-2 py-1 text-xs rounded bg-yellow-600/20 text-yellow-400 border border-yellow-600/30 hover:bg-yellow-600/40 transition-colors"
                                                >
                                                    Cảnh báo
                                                </button>
                                            )}
                                            {/* Role toggle */}
                                            {user.role === 'ROLE_USER' ? (
                                                <button
                                                    onClick={() => openRoleDialog(user, 'ROLE_ADMIN')}
                                                    className="px-2 py-1 text-xs rounded bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/40 transition-colors"
                                                >
                                                    → Admin
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => openRoleDialog(user, 'ROLE_USER')}
                                                    className="px-2 py-1 text-xs rounded bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/40 transition-colors"
                                                >
                                                    → User
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-2">
                <p className="text-center text-xs text-gray-500 mb-1">
                    Tổng {totalElements} người dùng
                </p>
                {totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        maxPages={totalPages}
                        onPageChange={onPageChange}
                        loading={loading}
                    />
                )}
            </div>

            {/* Confirm Dialog */}
            {confirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        {confirm.type === 'role' && (
                            <>
                                <h3 className="text-lg font-bold text-purple-400 mb-2">Đổi vai trò</h3>
                                <p className="text-gray-300 text-sm mb-4">
                                    Đổi vai trò của <span className="font-semibold text-white">{confirm.user.email}</span> thành <span className="font-semibold text-white">{ROLE_LABEL[confirm.newRole!]}</span>?
                                </p>
                            </>
                        )}
                        {confirm.type === 'status' && (
                            <>
                                <h3 className="text-lg font-bold text-yellow-400 mb-2">
                                    {confirm.newStatus === 'BANNED' ? 'Ban tài khoản' : confirm.newStatus === 'WARNING' ? 'Cảnh báo tài khoản' : 'Mở khóa tài khoản'}
                                </h3>
                                <p className="text-gray-300 text-sm mb-3">
                                    Người dùng: <span className="font-semibold text-white">{confirm.user.email}</span>
                                </p>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    placeholder="Lý do (tuỳ chọn)..."
                                    rows={2}
                                    className="w-full bg-slate-800 border border-slate-600 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 resize-none mb-4"
                                />
                            </>
                        )}
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={closeDialog}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors disabled:opacity-50"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50 bg-yellow-500 hover:bg-yellow-400 text-black"
                            >
                                {actionLoading ? 'Đang xử lý...' : 'Xác nhận'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserManagementTable;