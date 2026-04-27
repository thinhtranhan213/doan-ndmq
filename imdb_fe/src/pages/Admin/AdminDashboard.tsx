import React, { useEffect, useState } from 'react';
import { getDashboardStats } from '../../api/adminStatsService';
import type { DashboardStats, DayStat } from '../../types/admin.types';

// ── Metric Card ──────────────────────────────────────────────────────────────
interface MetricCardProps { label: string; value: number; sub?: string; color: string; icon: React.ReactNode }
const MetricCard: React.FC<MetricCardProps> = ({ label, value, sub, color, icon }) => {
    const iconBg = color === 'text-white'
        ? 'bg-slate-700'
        : color.replace('text-', 'bg-').replace('-400', '-400/10');
    return (
        <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4 flex items-start gap-3">
            <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
            <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 truncate">{label}</p>
                <p className={`text-2xl font-bold ${color} mt-0.5`}>{value.toLocaleString()}</p>
                {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
            </div>
        </div>
    );
};

// ── Bar Chart ────────────────────────────────────────────────────────────────
const BarChart: React.FC<{ data: DayStat[]; color: string }> = ({ data, color }) => {
    const max = Math.max(...data.map((d) => d.count), 1);
    const allZero = data.every((d) => d.count === 0);

    if (allZero) return (
        <div className="flex flex-col items-center justify-center h-24 gap-1">
            <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="text-xs text-slate-500">Chưa có dữ liệu</span>
        </div>
    );

    return (
        <div className="w-full">
            {/* Bar area — fixed pixel height so % bars render correctly */}
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
            {/* Date labels */}
            <div className="flex gap-1.5 mt-1">
                {data.map((d) => (
                    <span key={d.date} className="flex-1 text-center text-[10px] text-gray-500">{d.date.slice(5)}</span>
                ))}
            </div>
        </div>
    );
};

// ── Donut Chart ──────────────────────────────────────────────────────────────
interface Seg { value: number; color: string; label: string }
const DonutChart: React.FC<{ segments: Seg[] }> = ({ segments }) => {
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
        <div className="flex flex-col items-center gap-3">
            <div className="relative w-28 h-28">
                <div className="w-28 h-28 rounded-full" style={{ background: `conic-gradient(${gradient})` }} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center">
                        <span className="text-base font-bold text-white">{total.toLocaleString()}</span>
                    </div>
                </div>
            </div>
            <div className="space-y-1.5 w-full">
                {segments.map(s => (
                    <div key={s.label} className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                            <span className="text-gray-400">{s.label}</span>
                        </div>
                        <span className="font-semibold text-white">{s.value.toLocaleString()}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// ── Page ──────────────────────────────────────────────────────────────────────
const AdminDashboard: React.FC = () => {
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
    if (!stats) return <p className="text-red-400">Không thể tải dữ liệu tổng quan.</p>;

    const icons = {
        users: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
        check: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
        star:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>,
        flag:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" /></svg>,
        film:  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" /></svg>,
        new:   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>,
    };

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-white">Tổng quan hệ thống</h2>

            {/* ── Metric grid ── */}
            <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3">
                <MetricCard label="Tổng người dùng"     value={stats.totalUsers}         sub={`+${stats.newUsersThisWeek} tuần này`} color="text-white"        icon={icons.users} />
                <MetricCard label="Đang hoạt động"      value={stats.activeUsers}                                                    color="text-green-400"     icon={icons.check} />
                <MetricCard label="Cảnh báo"            value={stats.warningUsers}                                                   color="text-yellow-400"    icon={icons.flag}  />
                <MetricCard label="Bị khoá"             value={stats.bannedUsers}                                                    color="text-red-400"       icon={icons.users} />
                <MetricCard label="Tổng đánh giá"       value={stats.totalReviews}        sub={`${stats.hiddenReviews} bị ẩn`}       color="text-white"         icon={icons.star}  />
                <MetricCard label="Vi phạm chờ xử lý"   value={stats.pendingViolations}                                              color="text-orange-400"    icon={icons.flag}  />
                <MetricCard label="Phim đang ẩn"        value={stats.hiddenFilmsCount}                                               color="text-blue-400"      icon={icons.film}  />
                <MetricCard label="Người dùng mới / tuần" value={stats.newUsersThisWeek}                                             color="text-emerald-400"   icon={icons.new}   />
            </div>

            {/* ── Trend charts (3 columns) ── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Người dùng mới (7 ngày)</p>
                    <BarChart data={stats.userChart} color="bg-yellow-400/80" />
                </div>
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Đánh giá mới (7 ngày)</p>
                    <BarChart data={stats.reviewChart} color="bg-blue-400/80" />
                </div>
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3">Vi phạm mới (7 ngày)</p>
                    <BarChart data={stats.violationChart} color="bg-red-400/80" />
                </div>
            </div>

            {/* ── Distribution donuts ── */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Phân bố người dùng</p>
                    <DonutChart segments={[
                        { value: stats.activeUsers,   color: '#4ade80', label: 'Hoạt động' },
                        { value: stats.warningUsers,  color: '#facc15', label: 'Cảnh báo' },
                        { value: stats.bannedUsers,   color: '#f87171', label: 'Bị khoá' },
                    ]} />
                </div>
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Phân bố đánh giá</p>
                    <DonutChart segments={[
                        { value: stats.totalReviews - stats.hiddenReviews, color: '#4ade80', label: 'Hiển thị' },
                        { value: stats.hiddenReviews,                      color: '#64748b', label: 'Đã ẩn' },
                    ]} />
                </div>
                <div className="bg-slate-900 border border-slate-700/60 rounded-xl p-5">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 mb-4">Phân bố vi phạm</p>
                    <DonutChart segments={[
                        { value: stats.pendingViolations,  color: '#fb923c', label: 'Chờ xử lý' },
                        { value: stats.resolvedViolations, color: '#4ade80', label: 'Đã xử lý' },
                        { value: stats.ignoredViolations,  color: '#64748b', label: 'Bỏ qua' },
                    ]} />
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;