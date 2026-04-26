import React, { useEffect, useRef, useState } from 'react';
import type { FilmOverrideDTO, PagedResponse } from '../../types/admin.types';
import type { Movie } from '../../types/movie.types';
import * as filmService from '../../api/adminFilmService';
import { searchMovies } from '../../api/endpoints';
import ConfirmDialog from '../../components/Admin/ConfirmDialog';
import Pagination from '../../components/Pagination/Pagination';

const TMDB_IMG = 'https://image.tmdb.org/t/p/w92';
const TMDB_IMG_LG = 'https://image.tmdb.org/t/p/w185';

let toastId = 0;
interface Toast { id: number; type: 'success' | 'error'; message: string }

const FilmManagement: React.FC = () => {
    // ── Search state ──────────────────────────────────────────────────
    const [query, setQuery]               = useState('');
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [searching, setSearching]       = useState(false);
    const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ── Hide modal ────────────────────────────────────────────────────
    const [hideTarget, setHideTarget]     = useState<Movie | null>(null);
    const [reason, setReason]             = useState('');
    const [reasonError, setReasonError]   = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // ── Blacklist table ───────────────────────────────────────────────
    const [pagedData, setPagedData]       = useState<PagedResponse<FilmOverrideDTO> | null>(null);
    const [blacklistIds, setBlacklistIds] = useState<Set<number>>(new Set());
    const [listLoading, setListLoading]   = useState(false);
    const [currentPage, setCurrentPage]   = useState(1);
    const [removeTarget, setRemoveTarget] = useState<FilmOverrideDTO | null>(null);

    // ── Toasts ────────────────────────────────────────────────────────
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: 'success' | 'error', msg: string) => {
        const id = ++toastId;
        setToasts((p) => [...p, { id, type, message: msg }]);
        setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
    };

    // ── Fetch blacklist ───────────────────────────────────────────────
    const fetchBlacklist = async (page: number) => {
        setListLoading(true);
        try {
            const res = await filmService.getBlacklist(page - 1, 20);
            setPagedData(res);
            setBlacklistIds(new Set(res.data.map((f) => f.tmdbId)));
        } catch {
            showToast('error', 'Không thể tải danh sách phim ẩn');
        } finally {
            setListLoading(false);
        }
    };

    useEffect(() => { fetchBlacklist(currentPage); }, [currentPage]);

    // ── TMDB search (debounced 400 ms) ────────────────────────────────
    const handleQueryChange = (value: string) => {
        setQuery(value);
        if (searchTimer.current) clearTimeout(searchTimer.current);
        if (!value.trim()) { setSearchResults([]); return; }
        searchTimer.current = setTimeout(async () => {
            setSearching(true);
            try {
                const res = await searchMovies(value);
                setSearchResults(res.results.slice(0, 12));
            } catch {
                showToast('error', 'Tìm kiếm thất bại');
            } finally {
                setSearching(false);
            }
        }, 400);
    };

    // ── Hide movie ────────────────────────────────────────────────────
    const openHideModal = (movie: Movie) => {
        setHideTarget(movie);
        setReason('');
        setReasonError('');
    };

    const handleHide = async () => {
        if (!hideTarget) return;
        if (!reason.trim()) { setReasonError('Vui lòng nhập lý do ẩn phim'); return; }
        setActionLoading(true);
        try {
            await filmService.addToBlacklist({
                tmdbId: hideTarget.id,
                title: hideTarget.title,
                posterPath: hideTarget.poster_path ?? undefined,
                reason: reason.trim(),
            });
            showToast('success', `Đã ẩn "${hideTarget.title}"`);
            setHideTarget(null);
            fetchBlacklist(1);
            setCurrentPage(1);
        } catch (err: any) {
            showToast('error', err?.response?.data?.message ?? 'Ẩn phim thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    // ── Unban movie ───────────────────────────────────────────────────
    const handleRemove = async () => {
        if (!removeTarget) return;
        setActionLoading(true);
        try {
            await filmService.removeFromBlacklist(removeTarget.id);
            showToast('success', `Đã bỏ ẩn "${removeTarget.title}"`);
            setRemoveTarget(null);
            fetchBlacklist(currentPage);
        } catch {
            showToast('error', 'Bỏ ẩn thất bại');
        } finally {
            setActionLoading(false);
        }
    };

    const fmtDate = (s: string) => new Date(s).toLocaleDateString('vi-VN');

    return (
        <div className="space-y-6">
            {/* ── Header ── */}
            <div>
                <h2 className="text-xl font-bold text-white">Quản lý phim ẩn</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                    Tìm phim từ TMDB và ẩn khỏi toàn bộ app
                </p>
            </div>

            {/* ── TMDB Search ── */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl p-5 space-y-4">
                <p className="text-sm font-semibold text-gray-300">Tìm kiếm phim để ẩn</p>
                <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => handleQueryChange(e.target.value)}
                        placeholder="Nhập tên phim..."
                        className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
                    />
                    {searching && (
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    )}
                </div>

                {/* Search results */}
                {searchResults.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 pt-1">
                        {searchResults.map((movie) => {
                            const hidden = blacklistIds.has(movie.id);
                            const year = movie.release_date?.slice(0, 4) ?? '—';
                            return (
                                <div
                                    key={movie.id}
                                    className={`relative flex flex-col rounded-lg overflow-hidden border transition-colors ${hidden ? 'border-red-700/40 opacity-60' : 'border-slate-700 hover:border-slate-500'} bg-slate-800`}
                                >
                                    {/* Poster */}
                                    <div className="relative w-full aspect-[2/3] bg-slate-700 flex-shrink-0">
                                        {movie.poster_path ? (
                                            <img
                                                src={`${TMDB_IMG_LG}${movie.poster_path}`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                                </svg>
                                            </div>
                                        )}
                                        {hidden && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                                                <span className="text-xs font-bold text-red-400 bg-black/70 px-2 py-0.5 rounded">Đã ẩn</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Info + button */}
                                    <div className="flex flex-col flex-1 p-2 gap-2">
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-white leading-tight line-clamp-2">{movie.title}</p>
                                            <p className="text-xs text-gray-500 mt-0.5">{year}</p>
                                        </div>
                                        <button
                                            disabled={hidden}
                                            onClick={() => openHideModal(movie)}
                                            className={`w-full py-1 text-xs font-semibold rounded transition-colors ${hidden ? 'bg-slate-700 text-gray-500 cursor-not-allowed' : 'bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/40'}`}
                                        >
                                            {hidden ? 'Đã ẩn' : 'Ẩn phim'}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {!searching && query.trim() && searchResults.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-4">Không tìm thấy phim nào.</p>
                )}
            </div>

            {/* ── Blacklist table ── */}
            <div className="space-y-3">
                {/* Stats strip */}
                <div className="grid grid-cols-3 gap-3">
                    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col gap-0.5">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Phim đang ẩn</span>
                        <span className="text-2xl font-bold text-red-400">{(pagedData?.totalElements ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col gap-0.5">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Trang hiện tại</span>
                        <span className="text-2xl font-bold text-white">{(pagedData?.data.length ?? 0).toLocaleString()}</span>
                    </div>
                    <div className="bg-slate-900 border border-slate-700/60 rounded-xl px-4 py-3 flex flex-col gap-0.5">
                        <span className="text-xs text-gray-500 uppercase tracking-wider">Tổng trang</span>
                        <span className="text-2xl font-bold text-slate-400">{(pagedData?.totalPages ?? 0).toLocaleString()}</span>
                    </div>
                </div>

                {listLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin" />
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto rounded-xl border border-slate-700">
                            <table className="w-full text-sm">
                                <thead className="bg-slate-800 text-gray-400 uppercase text-xs">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Phim</th>
                                        <th className="px-4 py-3 text-left">TMDB ID</th>
                                        <th className="px-4 py-3 text-left">Lý do</th>
                                        <th className="px-4 py-3 text-left">Ngày ẩn</th>
                                        <th className="px-4 py-3 text-center">Thao tác</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-700/50">
                                    {(pagedData?.data ?? []).map((film) => (
                                        <tr key={film.id} className="bg-slate-900 hover:bg-slate-800/60 transition-colors">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    {film.posterPath ? (
                                                        <img
                                                            src={`${TMDB_IMG}${film.posterPath}`}
                                                            alt={film.title}
                                                            className="w-8 h-12 object-cover rounded flex-shrink-0"
                                                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                        />
                                                    ) : (
                                                        <div className="w-8 h-12 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                    <span className="font-medium text-white">{film.title}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <a href={`https://www.themoviedb.org/movie/${film.tmdbId}`}
                                                    target="_blank" rel="noopener noreferrer"
                                                    className="text-blue-400 hover:underline">
                                                    #{film.tmdbId}
                                                </a>
                                            </td>
                                            <td className="px-4 py-3 text-gray-300 max-w-[240px] truncate">{film.reason ?? '—'}</td>
                                            <td className="px-4 py-3 text-gray-400">{fmtDate(film.createdAt)}</td>
                                            <td className="px-4 py-3 text-center">
                                                <button
                                                    onClick={() => setRemoveTarget(film)}
                                                    className="px-3 py-1 text-xs rounded bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/40 transition-colors"
                                                >
                                                    Bỏ ẩn
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {(pagedData?.data ?? []).length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="text-center py-12 text-gray-500">
                                                Chưa có phim nào bị ẩn.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {pagedData && pagedData.totalPages > 1 && (
                            <Pagination currentPage={currentPage} maxPages={pagedData.totalPages}
                                onPageChange={setCurrentPage} loading={listLoading} />
                        )}
                    </>
                )}
            </div>

            {/* ── Hide modal ── */}
            {hideTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-lg font-bold text-red-400 mb-4">Ẩn phim khỏi app</h3>

                        {/* Movie preview */}
                        <div className="flex items-center gap-3 mb-5 bg-slate-800 rounded-xl p-3">
                            {hideTarget.poster_path ? (
                                <img
                                    src={`${TMDB_IMG_LG}${hideTarget.poster_path}`}
                                    alt={hideTarget.title}
                                    className="w-12 h-18 object-cover rounded flex-shrink-0"
                                    style={{ height: '4.5rem' }}
                                />
                            ) : (
                                <div className="w-12 bg-slate-700 rounded flex-shrink-0" style={{ height: '4.5rem' }} />
                            )}
                            <div>
                                <p className="font-semibold text-white text-sm">{hideTarget.title}</p>
                                <p className="text-xs text-gray-400 mt-0.5">
                                    {hideTarget.release_date?.slice(0, 4) ?? ''}
                                    {hideTarget.vote_average > 0 && ` · ★ ${hideTarget.vote_average.toFixed(1)}`}
                                </p>
                            </div>
                        </div>

                        {/* Reason */}
                        <label className="text-xs text-gray-400 mb-1 block">Lý do ẩn *</label>
                        <textarea
                            value={reason}
                            onChange={(e) => { setReason(e.target.value); setReasonError(''); }}
                            placeholder="Nội dung vi phạm, không phù hợp..."
                            rows={3}
                            className={`w-full bg-slate-800 border rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none resize-none mb-1 ${reasonError ? 'border-red-500 focus:border-red-500' : 'border-slate-600 focus:border-yellow-500'}`}
                        />
                        {reasonError && <p className="text-red-400 text-xs mb-3">{reasonError}</p>}

                        <div className="flex gap-3 justify-end mt-4">
                            <button
                                onClick={() => setHideTarget(null)}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm rounded-lg bg-slate-700 text-gray-300 hover:bg-slate-600 transition-colors disabled:opacity-50"
                            >
                                Huỷ
                            </button>
                            <button
                                onClick={handleHide}
                                disabled={actionLoading}
                                className="px-4 py-2 text-sm font-semibold rounded-lg bg-red-600 hover:bg-red-500 text-white transition-colors disabled:opacity-50"
                            >
                                {actionLoading ? 'Đang xử lý...' : 'Xác nhận ẩn'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ── Unban confirm ── */}
            <ConfirmDialog
                isOpen={!!removeTarget}
                title="Bỏ ẩn phim"
                message={`Bỏ ẩn "${removeTarget?.title}" (TMDB #${removeTarget?.tmdbId}) — phim sẽ xuất hiện lại trên app.`}
                confirmLabel="Bỏ ẩn"
                loading={actionLoading}
                onConfirm={handleRemove}
                onClose={() => setRemoveTarget(null)}
            />

            {/* ── Toasts ── */}
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

export default FilmManagement;
