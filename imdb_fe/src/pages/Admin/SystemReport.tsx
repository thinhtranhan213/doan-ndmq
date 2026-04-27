import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminStatsService';
import type { DashboardStats, DayStat } from '../../types/admin.types';

// ── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart: React.FC<{ data: DayStat[]; color: string; label: string }> = ({ data, color, label }) => {
    const max = Math.max(...data.map((d) => d.count), 1);
    const allZero = data.every((d) => d.count === 0);

    return (
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">{label}</p>
            {allZero ? (
                <div className="flex flex-col items-center justify-center gap-1" style={{ height: 80 }}>
                    <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span className="text-xs text-slate-500">Chưa có dữ liệu</span>
                </div>
            ) : (
                <div className="w-full">
                    <div className="relative flex gap-1.5" style={{ height: 80 }}>
                        {data.map((d) => {
                            const pct = Math.max((d.count / max) * 100, 3);
                            return (
                                <div key={d.date} className="relative flex-1 group">
                                    <div
                                        className={`absolute bottom-0 left-0 right-0 rounded-t transition-all ${color}`}
                                        style={{ height: `${pct}%` }}
                                        title={`${d.date}: ${d.count}`}
                                    />
                                    <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                        {d.count}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="flex gap-1.5 mt-1">
                        {data.map((d) => (
                            <span key={d.date} className="flex-1 text-center text-[10px] text-gray-500">{d.date.slice(5)}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

// ── Donut Chart ──────────────────────────────────────────────────────────────
interface Seg { value: number; color: string; label: string }
const DonutChart: React.FC<{ segments: Seg[]; title: string }> = ({ segments, title }) => {
    const total = segments.reduce((s, x) => s + x.value, 0);
    let cum = 0;
    const gradient = total > 0
        ? segments.map(s => {
            const from = (cum / total) * 100;
            cum += s.value;
            return `${s.color} ${from.toFixed(1)}% ${(cum / total * 100).toFixed(1)}%`;
        }).join(', ')
        : '#334155 0% 100%';

    return (
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">{title}</p>
            <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 flex-shrink-0">
                    <div className="w-24 h-24 rounded-full" style={{ background: `conic-gradient(${gradient})` }} />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 bg-slate-900 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-white">{total.toLocaleString()}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1 space-y-2">
                    {segments.map(s => (
                        <div key={s.label} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                                <span className="text-gray-400">{s.label}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-semibold text-white">{s.value.toLocaleString()}</span>
                                <span className="text-gray-600 w-10 text-right">
                                    {total > 0 ? `${((s.value / total) * 100).toFixed(0)}%` : '—'}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// ── Stat Row ─────────────────────────────────────────────────────────────────
const StatRow: React.FC<{ label: string; value: number; color?: string }> = ({ label, value, color = 'text-white' }) => (
    <tr className="hover:bg-slate-800/40">
        <td className="px-5 py-3 text-gray-400">{label}</td>
        <td className={`px-5 py-3 text-right font-semibold ${color}`}>{value.toLocaleString()}</td>
    </tr>
);

// ── Page ──────────────────────────────────────────────────────────────────────
const SystemReport: React.FC = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDashboardStats().then(setStats).catch(console.error).finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
        </div>
    );
    if (!stats) return <p className="text-red-400">Không thể tải dữ liệu.</p>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Báo cáo hệ thống</h2>

            {/* ── Summary table ── */}
            <div className="bg-slate-900 border border-slate-700/60 rounded-xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-700/60">
                    <p className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tóm tắt toàn hệ thống</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-slate-700/60">
                    {/* Users */}
                    <table className="w-full text-sm">
                        <thead><tr><th colSpan={2} className="px-5 py-2 text-left text-xs text-yellow-400 uppercase tracking-wider bg-slate-800/50">Người dùng</th></tr></thead>
                        <tbody className="divide-y divide-slate-800">
                            <StatRow label="Tổng tài khoản"      value={stats.totalUsers} />
                            <StatRow label="Đang hoạt động"      value={stats.activeUsers}   color="text-green-400" />
                            <StatRow label="Cảnh báo"            value={stats.warningUsers}  color="text-yellow-400" />
                            <StatRow label="Bị khoá"             value={stats.bannedUsers}   color="text-red-400" />
                            <StatRow label="Mới trong 7 ngày"    value={stats.newUsersThisWeek} color="text-blue-400" />
                        </tbody>
                    </table>
                    {/* Reviews */}
                    <table className="w-full text-sm">
                        <thead><tr><th colSpan={2} className="px-5 py-2 text-left text-xs text-blue-400 uppercase tracking-wider bg-slate-800/50">Đánh giá</th></tr></thead>
                        <tbody className="divide-y divide-slate-800">
                            <StatRow label="Tổng đánh giá"    value={stats.totalReviews} />
                            <StatRow label="Đang hiển thị"    value={stats.totalReviews - stats.hiddenReviews} color="text-green-400" />
                            <StatRow label="Đã ẩn"            value={stats.hiddenReviews} color="text-slate-400" />
                        </tbody>
                    </table>
                    {/* Violations & Films */}
                    <table className="w-full text-sm">
                        <thead><tr><th colSpan={2} className="px-5 py-2 text-left text-xs text-orange-400 uppercase tracking-wider bg-slate-800/50">Vi phạm & Phim</th></tr></thead>
                        <tbody className="divide-y divide-slate-800">
                            <StatRow label="Tổng báo cáo"     value={stats.totalViolations} />
                            <StatRow label="Chờ xử lý"        value={stats.pendingViolations}  color="text-orange-400" />
                            <StatRow label="Đã xử lý"         value={stats.resolvedViolations} color="text-green-400" />
                            <StatRow label="Bỏ qua"           value={stats.ignoredViolations}  color="text-slate-400" />
                            <StatRow label="Phim đang ẩn"     value={stats.hiddenFilmsCount}   color="text-red-400" />
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Trend charts ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <BarChart data={stats.userChart}      color="bg-yellow-400/80" label="Người dùng mới (7 ngày)" />
                <BarChart data={stats.reviewChart}    color="bg-blue-400/80"   label="Đánh giá mới (7 ngày)"  />
                <BarChart data={stats.violationChart} color="bg-red-400/80"    label="Vi phạm mới (7 ngày)"   />
            </div>

            {/* ── Distribution donuts ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <DonutChart title="Phân bố người dùng" segments={[
                    { value: stats.activeUsers,   color: '#4ade80', label: 'Hoạt động' },
                    { value: stats.warningUsers,  color: '#facc15', label: 'Cảnh báo'  },
                    { value: stats.bannedUsers,   color: '#f87171', label: 'Bị khoá'   },
                ]} />
                <DonutChart title="Phân bố đánh giá" segments={[
                    { value: stats.totalReviews - stats.hiddenReviews, color: '#4ade80', label: 'Hiển thị' },
                    { value: stats.hiddenReviews,                      color: '#64748b', label: 'Đã ẩn'    },
                ]} />
                <DonutChart title="Phân bố vi phạm" segments={[
                    { value: stats.pendingViolations,  color: '#fb923c', label: 'Chờ xử lý' },
                    { value: stats.resolvedViolations, color: '#4ade80', label: 'Đã xử lý'  },
                    { value: stats.ignoredViolations,  color: '#64748b', label: 'Bỏ qua'    },
                ]} />
            </div>
        </div>
    );
};

export default SystemReport;