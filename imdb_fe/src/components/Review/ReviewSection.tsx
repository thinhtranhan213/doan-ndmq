import React, { useEffect, useState } from 'react';
import { ReviewDto } from '../../types/review.types';
import { getReviewsByFilm, getMyReview, getScoreDistribution } from '../../api/reviewService';
import { useAuthStore } from '../../store/authStore';
import ReviewForm from './ReviewForm';
import ReviewCard from './ReviewCard';

interface Props {
    filmId: number;
}

const SORT_OPTIONS = [
    { value: 'newest', label: 'Mới nhất' },
    { value: 'highest', label: 'Điểm cao nhất' },
    { value: 'lowest', label: 'Điểm thấp nhất' },
    { value: 'mostLiked', label: 'Nhiều like nhất' },
];

const ReviewSection: React.FC<Props> = ({ filmId }) => {
    const { isAuthenticated } = useAuthStore();
    const [reviews, setReviews] = useState<ReviewDto[]>([]);
    const [myReview, setMyReview] = useState<ReviewDto | null>(null);
    const [distribution, setDistribution] = useState<Record<number, number>>({});
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(false);


    const loadReviews = async (p = 0, s = sort) => {
        setLoading(true);
        try {
            const res = await getReviewsByFilm(filmId, p, 10, s);
            setReviews(p === 0 ? res.content : [...reviews, ...res.content]);
            setTotalPages(res.totalPages);
            setPage(p);
        } finally {
            setLoading(false);
        }
    };

    const loadMyReview = async () => {
        if (!isAuthenticated) return;
        try {
            const r = await getMyReview(filmId);
            setMyReview(r);
        } catch {
            setMyReview(null);
        }
    };

    const loadDistribution = async () => {
        try {
            const d = await getScoreDistribution(filmId);
            setDistribution(d);
        } catch {
            // ignore
        }
    };

    useEffect(() => {
        loadReviews(0, sort);
        loadMyReview();
        loadDistribution();
    }, [filmId, isAuthenticated]);

    const handleSortChange = (s: string) => {
        setSort(s);
        loadReviews(0, s);
    };

    const handleReviewSaved = (saved: ReviewDto) => {
        setMyReview(saved);
        // Refresh the list
        loadReviews(0, sort);
        loadDistribution();
    };

    const handleDeleted = (id: number) => {
        setReviews(prev => prev.filter(r => r.id !== id));
        if (myReview?.id === id) setMyReview(null);
        loadDistribution();
    };

    const handleUpdated = (updated: ReviewDto) => {
        setReviews(prev => prev.map(r => r.id === updated.id ? updated : r));
        if (myReview?.id === updated.id) setMyReview(updated);
    };

    const totalReviews = Object.values(distribution).reduce((a, b) => a + b, 0);
    const avgScore = totalReviews > 0
        ? Object.entries(distribution).reduce((sum, [score, count]) => sum + Number(score) * count, 0) / totalReviews
        : 0;

    return (
        <div className="mb-12">
            <h2 className="text-3xl font-bold text-white mb-6">⭐ Đánh giá</h2>

            {/* Score Distribution */}
            {totalReviews > 0 && (
                <div className="bg-slate-800 rounded-lg p-5 mb-6 flex gap-8 items-center">
                    <div className="text-center">
                        <p className="text-5xl font-bold text-yellow-400">{avgScore.toFixed(1)}</p>
                        <p className="text-gray-400 text-sm mt-1">{totalReviews} đánh giá</p>
                    </div>
                    <div className="flex-1 space-y-1">
                        {Array.from({ length: 10 }, (_, i) => 10 - i).map(score => {
                            const count = distribution[score] ?? 0;
                            const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                            return (
                                <div key={score} className="flex items-center gap-2 text-xs">
                                    <span className="text-gray-400 w-4 text-right">{score}</span>
                                    <div className="flex-1 bg-slate-600 rounded-full h-2">
                                        <div
                                            className="bg-yellow-400 h-2 rounded-full transition-all"
                                            style={{ width: `${pct}%` }}
                                        />
                                    </div>
                                    <span className="text-gray-500 w-5">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* My review / write form */}
            {isAuthenticated && !myReview && (
                <div className="mb-6">
                    <ReviewForm filmId={filmId} onSaved={handleReviewSaved} />
                </div>
            )}

            {/* Sort */}
            <div className="flex items-center gap-3 mb-4">
                <span className="text-gray-400 text-sm">Sắp xếp:</span>
                {SORT_OPTIONS.map(o => (
                    <button
                        key={o.value}
                        onClick={() => handleSortChange(o.value)}
                        className={`px-3 py-1 rounded text-sm cursor-pointer transition
                            ${sort === o.value
                                ? 'bg-yellow-500 text-black font-semibold'
                                : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                            }`}
                    >
                        {o.label}
                    </button>
                ))}
            </div>

            {/* Review list */}
            {loading && reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">Đang tải...</div>
            ) : reviews.length === 0 ? (
                <div className="bg-slate-800 rounded-lg p-8 text-center text-slate-400">
                    Chưa có đánh giá nào. Hãy là người đầu tiên!
                </div>
            ) : (
                <>
                    {reviews.map(r => (
                        <ReviewCard
                            key={r.id}
                            review={r}
                            isAuthenticated={isAuthenticated}
                            onDeleted={handleDeleted}
                            onUpdated={handleUpdated}
                        />
                    ))}
                    {page + 1 < totalPages && (
                        <button
                            onClick={() => loadReviews(page + 1)}
                            disabled={loading}
                            className="w-full py-3 rounded bg-slate-700 text-gray-300 hover:bg-slate-600 transition cursor-pointer disabled:opacity-50"
                        >
                            {loading ? 'Đang tải...' : 'Xem thêm'}
                        </button>
                    )}
                </>
            )}
        </div>
    );
};

export default ReviewSection;
