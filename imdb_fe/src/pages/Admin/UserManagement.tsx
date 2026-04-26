import React, { useEffect, useRef, useState } from 'react';
import type { UserAdminDTO, UserFilters, UserStatus, UserRole, PagedResponse, DashboardStats } from '../../types/admin.types';
import * as adminService from '../../api/adminService';
import { getDashboardStats } from '../../api/adminStatsService';
import UserManagementTable from './UserManagementTable';

interface StatPillProps { label: string; value: number; color: string }
const StatPill: React.FC<StatPillProps> = ({ label, value, color }) => (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col gap-0.5">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</span>
    </div>
);

let toastId = 0;
interface Toast { id: number; type: 'success' | 'error'; message: string }

const UserManagement: React.FC = () => {
    const [stats, setStats]         = useState<DashboardStats | null>(null);
    const [pagedData, setPagedData] = useState<PagedResponse<UserAdminDTO> | null>(null);
    const [loading, setLoading]     = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters]     = useState<UserFilters>({ status: '', role: '', search: '' });
    const [searchInput, setSearchInput] = useState('');
    const [toasts, setToasts]       = useState<Toast[]>([]);
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
                role:   f.role   || undefined,
                search: f.search || undefined,
            });
            setPagedData(res);
        } catch {
            showToast('error', 'Không thể tải danh sách người dùng');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { getDashboardStats().then(setStats).catch(console.error); }, []);
    useEffect(() => { fetchUsers(currentPage, filters); }, [currentPage, filters]);

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

    const handleStatusChange = async (user: UserAdminDTO, status: UserStatus, reason: string) => {
        try {
            await adminService.updateUserStatus(user.id, { userId: user.id, status, reason });
            showToast('success', `Đã cập nhật trạng thái của ${user.email}`);
            fetchUsers(currentPage, filters);
        } catch {
            showToast('error', 'Cập nhật trạng thái thất bại');
            throw new Error('failed');
        }
    };

    const handleRoleChange = async (user: UserAdminDTO, role: UserRole) => {
        try {
            await adminService.updateUserRole(user.id, { userId: user.id, role });
            showToast('success', `Đã đổi vai trò của ${user.email}`);
            fetchUsers(currentPage, filters);
        } catch {
            showToast('error', 'Đổi vai trò thất bại');
            throw new Error('failed');
        }
    };

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Quản lý người dùng</h2>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    <StatPill label="Tổng tài khoản"   value={stats.totalUsers}       color="text-white" />
                    <StatPill label="Hoạt động"         value={stats.activeUsers}      color="text-green-400" />
                    <StatPill label="Cảnh báo"          value={stats.warningUsers}     color="text-yellow-400" />
                    <StatPill label="Bị khoá"           value={stats.bannedUsers}      color="text-red-400" />
                    <StatPill label="Mới / tuần"        value={stats.newUsersThisWeek} color="text-blue-400" />
                </div>
            )}

            <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-400">Danh sách tài khoản</h2>
                {pagedData && (
                    <p className="text-sm text-gray-400">
                        Tổng <span className="text-yellow-400 font-semibold">{pagedData.totalElements}</span> tài khoản
                    </p>
                )}
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-3">
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
                    onClick={() => { setSearchInput(''); setFilters({ status: '', role: '', search: '' }); setCurrentPage(1); }}
                    className="px-4 py-2 text-sm bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors"
                >
                    Đặt lại
                </button>
            </div>

            <UserManagementTable
                users={pagedData?.data ?? []}
                loading={loading}
                currentPage={currentPage}
                totalPages={pagedData?.totalPages ?? 1}
                totalElements={pagedData?.totalElements ?? 0}
                onPageChange={setCurrentPage}
                onStatusChange={handleStatusChange}
                onRoleChange={handleRoleChange}
            />

            {/* Toasts */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div key={t.id} className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium pointer-events-auto ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        {t.type === 'success' ? '✓ ' : '✕ '}{t.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserManagement;