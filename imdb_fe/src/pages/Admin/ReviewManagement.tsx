import React, { useEffect, useState } from 'react';
import type { AdminReviewDTO, PagedResponse, DashboardStats } from '../../types/admin.types';
import * as reviewService from '../../api/adminReviewService';
import { getDashboardStats } from '../../api/adminStatsService';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';

interface StatPillProps { label: string; value: number; color: string }
const StatPill: React.FC<StatPillProps> = ({ label, value, color }) => (
    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col gap-0.5">
        <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
        <span className={`text-2xl font-bold ${color}`}>{value.toLocaleString()}</span>
    </div>
);

let toastId = 0;
interface Toast { id: number; type: 'success' | 'error'; message: string }

const ReviewManagement: React.FC = () => {
    const [stats, setStats]         = useState<DashboardStats | null>(null);
    const [pagedData, setPagedData] = useState<PagedResponse<AdminReviewDTO> | null>(null);
    const [loading, setLoading]     = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState<AdminReviewDTO | null>(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [toasts, setToasts]       = useState<Toast[]>([]);

    const showToast = (type: 'success' | 'error', msg: string) => {
        const id = ++toastId;
        setToasts((p) => [...p, { id, type, message: msg }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    };

    const fetchData = async (page: number) => {
        setLoading(true);
        try {
            const res = await reviewService.getReviews(page - 1, 20);
            setPagedData(res);
        } catch { showToast('error', 'Không thể tải đánh giá'); }
        finally   { setLoading(false); }
    };

    useEffect(() => { getDashboardStats().then(setStats).catch(console.error); }, []);
    useEffect(() => { fetchData(currentPage); }, [currentPage]);

    const handleToggleHide = async (review: AdminReviewDTO) => {
        try {
            await reviewService.toggleHideReview(review.id);
            showToast('success', review.hidden ? 'Đã hiện đánh giá' : 'Đã ẩn đánh giá');
            fetchData(currentPage);
        } catch { showToast('error', 'Thao tác thất bại'); }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        setActionLoading(true);
        try {
            await reviewService.deleteReview(deleteTarget.id);
            showToast('success', 'Đã xoá đánh giá');
            setDeleteTarget(null);
            fetchData(currentPage);
        } catch { showToast('error', 'Xoá thất bại'); }
        finally   { setActionLoading(false); }
    };

    const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

    return (
        <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">Quản lý đánh giá</h2>

            {/* Stats */}
            {stats && (
                <div className="grid grid-cols-3 gap-3">
                    <StatPill label="Tổng đánh giá" value={stats.totalReviews}                              color="text-white" />
                    <StatPill label="Đang hiển thị" value={stats.totalReviews - stats.hiddenReviews}        color="text-green-400" />
                    <StatPill label="Đã ẩn"         value={stats.hiddenReviews}                             color="text-slate-400" />
                </div>
            )}

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
                                    <th className="px-4 py-3 text-left">Tác giả</th>
                                    <th className="px-4 py-3 text-left">Nội dung</th>
                                    <th className="px-4 py-3 text-center">Rating</th>
                                    <th className="px-4 py-3 text-left">Trạng thái</th>
                                    <th className="px-4 py-3 text-left">Ngày</th>
                                    <th className="px-4 py-3 text-center">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700/50">
                                {(pagedData?.data ?? []).map((r) => (
                                    <tr key={r.id} className={`hover:bg-slate-800/60 transition-colors ${r.hidden ? 'bg-slate-900/60 opacity-60' : 'bg-slate-900'}`}>
                                        <td className="px-4 py-3 text-gray-400">{r.id}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-white text-xs font-medium">{r.authorName}</p>
                                            <p className="text-gray-500 text-xs">{r.authorEmail}</p>
                                        </td>
                                        <td className="px-4 py-3 text-gray-300 max-w-[260px]">
                                            <p className="line-clamp-2">{r.content}</p>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className="text-yellow-400 font-bold">{r.rating}</span>
                                            <span className="text-gray-500 text-xs">/10</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {r.hidden
                                                ? <span className="px-2 py-0.5 rounded text-xs font-semibold bg-slate-600/30 text-slate-400 border border-slate-600/30">Đã ẩn</span>
                                                : <span className="px-2 py-0.5 rounded text-xs font-semibold bg-green-500/20 text-green-400 border border-green-500/30">Hiển thị</span>
                                            }
                                        </td>
                                        <td className="px-4 py-3 text-gray-400">{r.createdAt ? fmtDate(r.createdAt) : '—'}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex gap-1.5 justify-center">
                                                <button
                                                    onClick={() => handleToggleHide(r)}
                                                    className="px-2 py-1 text-xs rounded bg-slate-700 text-gray-300 border border-slate-600 hover:bg-slate-600 transition-colors"
                                                >
                                                    {r.hidden ? 'Hiện' : 'Ẩn'}
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(r)}
                                                    className="px-2 py-1 text-xs rounded bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/40 transition-colors"
                                                >
                                                    Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {(pagedData?.data ?? []).length === 0 && (
                                    <tr><td colSpan={7} className="text-center py-12 text-gray-500">Không có đánh giá nào.</td></tr>
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
                isOpen={!!deleteTarget}
                title="Xoá đánh giá"
                message={`Xoá đánh giá của "${deleteTarget?.authorName}"? Hành động không thể hoàn tác.`}
                confirmLabel="Xoá"
                danger
                loading={actionLoading}
                onConfirm={handleDelete}
                onClose={() => setDeleteTarget(null)}
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

export default ReviewManagement;