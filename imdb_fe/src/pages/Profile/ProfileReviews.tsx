import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { deleteReview } from '../../api/reviewService';
import { getMyReviews, getMovieDetails } from '../../api/endpoints';
import { ReviewDto } from '../../types/review.types';
import { Movie } from '../../types/movie.types';
import ReviewForm from '../../components/Review/ReviewForm';

interface ReviewWithMovie extends ReviewDto {
    movie?: Movie;
}

const ProfileReviews: React.FC = () => {
    const navigate = useNavigate();
    const [reviews, setReviews] = useState<ReviewWithMovie[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [deletingId, setDeletingId] = useState<number | null>(null);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const [error, setError] = useState('');

    const fetchPage = async (p: number, append: boolean) => {
        if (p === 0) setLoading(true); else setLoadingMore(true);
        setError('');
        try {
            const res = await getMyReviews(p, 10);
            const items: ReviewDto[] = res?.content ?? (Array.isArray(res) ? res as unknown as ReviewDto[] : []);
            const withMovies = await Promise.all(
                items.map(async r => ({
                    ...r,
                    movie: await getMovieDetails(r.filmId).catch(() => undefined),
                }))
            );
            setReviews(prev => append ? [...prev, ...withMovies] : withMovies);
            setHasMore(res?.totalPages ? p + 1 < res.totalPages : false);
            setPage(p);
        } catch {
            setError('Không thể tải đánh giá. Vui lòng thử lại.');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    useEffect(() => { fetchPage(0, false); }, []);

    const handleDelete = async (id: number) => {
        await deleteReview(id);
        setReviews(prev => prev.filter(r => r.id !== id));
        setDeletingId(null);
    };

    if (loading) return (
        <div className="bg-slate-900 rounded-lg p-8 text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-imdb-yellow mx-auto" />
        </div>
    );

    if (error) return (
        <div className="bg-slate-900 rounded-lg p-8 text-center">
            <p className="text-red-400 mb-3">{error}</p>
            <button onClick={() => fetchPage(0, false)} className="px-4 py-2 border border-slate-600 text-slate-400 rounded hover:border-imdb-yellow hover:text-imdb-yellow transition">
                Thử lại
            </button>
        </div>
    );

    if (reviews.length === 0) return (
        <div className="bg-slate-900 rounded-lg p-8 text-center">
            <p className="text-slate-400 mb-2">Bạn chưa có đánh giá nào.</p>
            <p className="text-slate-500 text-sm">Hãy xem phim và để lại nhận xét của bạn!</p>
        </div>
    );

    return (
        <div className="space-y-3">
            {reviews.map(r => (
                <div key={r.id} className="bg-slate-900 rounded-lg overflow-hidden">
                    {editingId === r.id ? (
                        <div className="p-4">
                            <ReviewForm
                                filmId={r.filmId}
                                existing={r}
                                onSaved={updated => {
                                    setReviews(prev => prev.map(x => x.id === r.id ? { ...x, ...updated } : x));
                                    setEditingId(null);
                                }}
                                onCancel={() => setEditingId(null)}
                            />
                        </div>
                    ) : (
                        <div className="flex gap-4 p-4">
                            {/* Movie poster */}
                            <div
                                className="flex-shrink-0 w-14 cursor-pointer"
                                onClick={() => navigate(`/movie/${r.filmId}`)}
                            >
                                <div className="aspect-[2/3] rounded overflow-hidden bg-slate-800">
                                    {r.movie?.poster_path ? (
                                        <img
                                            src={`https://image.tmdb.org/t/p/w92${r.movie.poster_path}`}
                                            alt={r.movie.title}
                                            className="w-full h-full object-cover hover:opacity-80 transition"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center p-1">
                                            <span className="text-slate-500 text-xs text-center leading-tight">No img</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Review content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                    <button
                                        className="text-white font-semibold hover:text-imdb-yellow transition truncate text-left"
                                        onClick={() => navigate(`/movie/${r.filmId}`)}
                                    >
                                        {r.movie?.title ?? `Phim #${r.filmId}`}
                                    </button>
                                    <span className="flex-shrink-0 bg-yellow-500 text-black text-xs font-bold px-2 py-0.5 rounded">
                                        ⭐ {r.score}/10
                                    </span>
                                </div>

                                <p className="text-slate-300 text-sm line-clamp-3 mb-3">{r.content}</p>

                                <div className="flex items-center justify-between flex-wrap gap-2">
                                    <span className="text-slate-500 text-xs">
                                        {new Date(r.createdAt).toLocaleDateString('vi-VN')}
                                        {r.isEdited && <span className="ml-1 italic">(đã chỉnh sửa)</span>}
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => setEditingId(r.id)}
                                            className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded hover:bg-slate-700 transition"
                                        >✏️ Sửa</button>
                                        {deletingId === r.id ? (
                                            <span className="flex items-center gap-1 text-xs">
                                                <span className="text-slate-400">Xóa?</span>
                                                <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-300 font-semibold">Có</button>
                                                <button onClick={() => setDeletingId(null)} className="text-slate-400 hover:text-white ml-1">Không</button>
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => setDeletingId(r.id)}
                                                className="text-slate-400 hover:text-red-400 text-xs px-2 py-1 rounded hover:bg-slate-700 transition"
                                            >🗑️ Xóa</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {hasMore && (
                <div className="text-center pt-2">
                    <button
                        onClick={() => fetchPage(page + 1, true)}
                        disabled={loadingMore}
                        className="px-6 py-2 border border-slate-600 text-slate-400 rounded hover:border-imdb-yellow hover:text-imdb-yellow transition disabled:opacity-50"
                    >
                        {loadingMore ? 'Đang tải...' : 'Xem thêm'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileReviews;
