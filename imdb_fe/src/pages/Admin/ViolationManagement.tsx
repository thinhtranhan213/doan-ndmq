import React, { useEffect, useState } from 'react';
import type { ViolationDTO, PagedResponse, DashboardStats } from '../../types/admin.types';
import * as violationService from '../../api/adminViolationService';
import { getDashboardStats } from '../../api/adminStatsService';
import StatusBadge from '../../components/Admin/StatusBadge';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';

interface StatPillProps { label: string; value: number; color: string }
const StatPill: React.FC<StatPillProps> = ({ label, value, color }) => (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col gap-0.5">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</span>
    </div>
);

type Action = 'ignore' | 'remove' | 'warn' | 'ban';

interface Confirm { action: Action; violation: ViolationDTO }

let toastId = 0;
interface Toast { id: number; type: 'success' | 'error'; message: string }

const ACTION_META: Record<Action, { label: string; danger: boolean; title: string }> = {
    ignore: { label: 'Bỏ qua',       danger: false, title: 'Bỏ qua báo cáo' },
    remove: { label: 'Xoá nội dung', danger: true,  title: 'Xoá nội dung vi phạm' },
    warn:   { label: 'Cảnh cáo',     danger: false, title: 'Cảnh cáo người dùng' },
    ban:    { label: 'Khoá tài khoản', danger: true, title: 'Khoá tài khoản người dùng' },
};

const ViolationManagement: React.FC = () => {
    const [stats, setStats]         = useState<DashboardStats | null>(null);
    const [pagedData, setPagedData] = useState<PagedResponse<ViolationDTO> | null>(null);
    const [loading, setLoading]     = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [confirm, setConfirm]     = useState<Confirm | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toasts, setToasts]       = useState<Toast[]>([]);

    const showToast = (type: 'success' | 'error', message: string) => {
        const id = ++toastId;
        setToasts((prev) => [...prev, { id, type, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
    };

    const fetchData = async (page: number, status: string) => {
        setLoading(true);
        try {
            const res = await violationService.getViolations(page - 1, 20, status || undefined);
            setPagedData(res);
        } catch { showToast('error', 'Không thể tải danh sách vi phạm'); }
        finally   { setLoading(false); }
    };

    useEffect(() => { getDashboardStats().then(setStats).catch(console.error); }, []);
    useEffect(() => { fetchData(currentPage, statusFilter); }, [currentPage, statusFilter]);

    const handleAction = async (reason?: string) => {
        if (!confirm) return;
        setActionLoading(true);
        try {
            const { id } = confirm.violation;
            if (confirm.action === 'ignore') await violationService.ignoreViolation(id, reason);
            if (confirm.action === 'remove') await violationService.removeContent(id, reason);
            if (confirm.action === 'warn')   await violationService.warnUser(id, reason);
            if (confirm.action === 'ban')    await violationService.banUserViaViolation(id, reason);
            showToast('success', 'Thao tác thành công');
            fetchData(currentPage, statusFilter);
            setConfirm(null);
        } catch { showToast('error', 'Thao tác thất bại'); }
        finally   { setActionLoading(false); }
    };

    const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Xử lý vi phạm</h2>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatPill label="Tổng báo cáo"  value={stats.totalViolations}   color="text-white" />
                    <StatPill label="Chờ xử lý"     value={stats.pendingViolations}  color="text-orange-400" />
                    <StatPill label="Đã xử lý"      value={stats.resolvedViolations} color="text-green-400" />
                    <StatPill label="Bỏ qua"        value={stats.ignoredViolations}  color="text-slate-400" />
                </div>
            )}

            <div className="flex gap-3">
                <select
                    value={statusFilter}
                    onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                    className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
                >
                    <option value="">Tất cả trạng thái</option>
                    <option value="PENDING">Chờ xử lý</option>
                    <option value="IGNORED">Bỏ qua</option>
                    <option value="RESOLVED">Đã xử lý</option>
                </select>
            </div>

            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-xl border border-slate-700">
                        <table className="w-full text-sm">
                            <thead className="bg-slate-800 text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-4 py-3 text-left">ID</th>
                                    <th className="px-4 py-3 text-left">Loại</th>
                                    <th className="px-4 py-3 text-left">Người báo cáo</th>
                                    <th className="px-4 py-3 text-left">Người bị báo cáo</th>
                                    <th className="px-4 py-3 text-left">Lý do</th>
                                    <th className="px-4 py-3 text-left">Trạng thái</th>
                                    <th className="px-4 py-3 text-left">Ngày</th>
                                    <th className="px-4 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {(pagedData?.data ?? []).map((v) => (
                                    <tr key={v.id} className="bg-slate-900 hover:bg-slate-800/60 transition-colors">
                                        <td className="px-4 py-3 text-gray-400">{v.id}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-xs px-2 py-0.5 rounded font-medium ${v.targetType === 'REVIEW' ? 'bg-blue-600/20 text-blue-400' : 'bg-purple-600/20 text-purple-400'}`}>
                                                {v.targetType === 'REVIEW' ? 'Đánh giá' : 'Bình luận'}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300">{v.reporterEmail}</td>
                                        <td className="px-4 py-3 text-gray-300">{v.targetUserEmail}</td>
                                        <td className="px-4 py-3 text-gray-300 max-w-[200px] truncate">{v.reason}</td>
                                        <td className="px-4 py-3"><StatusBadge value={v.status} /></td>
                                        <td className="px-4 py-3 text-gray-400">{fmtDate(v.createdAt)}</td>
                                        <td className="px-4 py-3">
                                            {v.status === 'PENDING' && (
                                                <div className="flex gap-1.5 justify-center flex-wrap">
                                                    {(['ignore','remove','warn','ban'] as Action[]).map((a) => (
                                                        <button
                                                            key={a}
                                                            onClick={() => setConfirm({ action: a, violation: v })}
                                                            className={`px-2 py-1 text-xs rounded border transition-colors ${
                                                                a === 'ban' || a === 'remove'
                                                                    ? 'bg-red-600/20 text-red-400 border-red-600/30 hover:bg-red-600/40'
                                                                    : 'bg-slate-700 text-gray-300 border-slate-600 hover:bg-slate-600'
                                                            }`}
                                                        >
                                                            {ACTION_META[a].label}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            {v.status !== 'PENDING' && (
                                                <span className="text-xs text-gray-500 text-center block">{v.resolution ?? '—'}</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {(pagedData?.data ?? []).length === 0 && (
                                    <tr><td colSpan={8} className="text-center py-12 text-gray-500">Không có báo cáo nào.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {pagedData && pagedData.totalPages > 1 && (
                        <Pagination currentPage={currentPage} maxPages={pagedData.totalPages} onPageChange={setCurrentPage} loading={loading} />
                    )}
                </>
            )}

            <ConfirmDialog
                isOpen={!!confirm}
                title={confirm ? ACTION_META[confirm.action].title : ''}
                message={confirm ? `Người bị báo cáo: ${confirm.violation.targetUserEmail}` : ''}
                danger={confirm ? ACTION_META[confirm.action].danger : false}
                withReason
                loading={actionLoading}
                onConfirm={handleAction}
                onClose={() => setConfirm(null)}
            />

            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
                {toasts.map((t) => (
                    <div key={t.id} className={`px-4 py-3 rounded-xl text-sm font-medium pointer-events-auto ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                        {t.type === 'success' ? '✓ ' : '✕ '}{t.message}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ViolationManagement;