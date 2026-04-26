import React, { useEffect, useRef, useState } from 'react';
import type { UserAdminDTO, UserFilters, UserStatus, UserRole, PagedResponse } from '../../types/admin.types';
import * as adminService from '../../api/adminService';
import UserManagementTable from './UserManagementTable';

// ---- Toast ----
interface Toast {
    id: number;
    type: 'success' | 'error';
    message: string;
}

let toastId = 0;

const AdminUsersPage: React.FC = () => {
    const [pagedData, setPagedData] = useState<PagedResponse<UserAdminDTO> | null>(null);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1); // 1-based for Pagination component
    const [filters, setFilters] = useState<UserFilters>({ status: '', role: '', search: '' });
    const [searchInput, setSearchInput] = useState('');
    const [toasts, setToasts] = useState<Toast[]>([]);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const showToast = (type: 'success' | 'error', message: string) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };

    const fetchUsers = async (page: number, f: UserFilters) => {
        setLoading(true);
        try {
            const res = await adminService.getUsers(page - 1, 20, {
                status: f.status || undefined,
                role: f.role || undefined,
                search: f.search || undefined,
            });
            setPagedData(res);
        } catch {
            showToast('error', 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers(currentPage, filters);
    }, [currentPage, filters]);

    // Debounce search input
    const handleSearchChange = (value: string) => {
        setSearchInput(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        searchTimer.current = setTimeout(() => {
            setCurrentPage(1);
            setFilters((prev) => ({ ...prev, search: value }));
        }, 400);
    };

    const handleFilterChange = (key: keyof UserFilters, value: string) => {
        setCurrentPage(1);
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleStatusChange = async (user: UserAdminDTO, status: UserStatus, reason: string) => {
        try {
            await adminService.updateUserStatus(user.id, { userId: user.id, status, reason });
            showToast('success', `Đã cập nhật trạng thái của ${user.email} thành ${status}`);
            fetchUsers(currentPage, filters);
        } catch {
            showToast('error', 'Cập nhật trạng thái thất bại');
            throw new Error('update failed');
        }
    };

    const handleRoleChange = async (user: UserAdminDTO, role: UserRole) => {
        try {
            await adminService.updateUserRole(user.id, { userId: user.id, role });
            showToast('success', `Đã đổi vai trò của ${user.email}`);
            fetchUsers(currentPage, filters);
        } catch {
            showToast('error', 'Đổi vai trò thất bại');
            throw new Error('update failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white px-4 py-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Quản lý người dùng</h1>
                    {pagedData && (
                        <p className="text-sm text-gray-400 mt-1">
                            Tổng cộng <span className="text-yellow-400 font-semibold">{pagedData.totalElements}</span> tài khoản
                        </p>
                    )}
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3 mb-6">
                    <input
                        type="text"
                        value={searchInput}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        placeholder="Tìm theo tên hoặc email..."
                        className="flex-1 min-w-[200px] bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    />
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="">Tất cả trạng thái</option>
                        <option value="ACTIVE">Hoạt động</option>
                        <option value="WARNING">Cảnh báo</option>
                        <option value="BANNED">Bị cấm</option>
                    </select>
                    <select
                        value={filters.role}
                        onChange={(e) => handleFilterChange('role', e.target.value)}
                        className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                    >
                        <option value="">Tất cả vai trò</option>
                        <option value="ROLE_USER">User</option>
                        <option value="ROLE_ADMIN">Admin</option>
                    </select>
                    <button
                        onClick={() => {
                            setSearchInput('');
                            setFilters({ status: '', role: '', search: '' });
                            setCurrentPage(1);
                        }}
                        className="px-4 py-2 text-sm bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        Đặt lại
                    </button>
                </div>

                {/* Table */}
                <UserManagementTable
                    users={pagedData?.data ?? []}
                    loading={loading}
                    currentPage={currentPage}
                    totalPages={pagedData?.totalPages ?? 1}
                    totalElements={pagedData?.totalElements ?? 0}
                    onPageChange={handlePageChange}
                    onStatusChange={handleStatusChange}
                    onRoleChange={handleRoleChange}
                />
            </div>

            {/* Toast Notifications */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in pointer-events-auto ${
                            toast.type === 'success'
                                ? 'bg-green-600 text-white'
                                : 'bg-red-600 text-white'
                        }`}
                    >
                        {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdminUsersPage;