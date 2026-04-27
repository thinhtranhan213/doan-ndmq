import React, { useState } from 'react';
import { ReviewDto } from '../../types/review.types';
import { createReview, updateReview } from '../../api/reviewService';

interface Props {
    filmId: number;
    existing?: ReviewDto;
    onSaved: (review: ReviewDto) => void;
    onCancel?: () => void;
}

const ReviewForm: React.FC<Props> = ({ filmId, existing, onSaved, onCancel }) => {
    const [score, setScore] = useState(existing?.score ?? 0);
    const [hover, setHover] = useState(0);
    const [content, setContent] = useState(existing?.content ?? '');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!score || !content.trim()) return;
        setSubmitting(true);
        setError('');
        try {
            const saved = existing
                ? await updateReview(existing.id, score, content)
                : await createReview(filmId, score, content);
            onSaved(saved);
            if (!existing) {
                setScore(0);
                setContent('');
            }
        } catch (e: unknown) {
            const err = e as { response?: { status?: number } };
            if (err?.response?.status === 409) {
                setError('Bạn đã đánh giá phim này rồi.');
            } else {
                setError('Có lỗi xảy ra, vui lòng thử lại.');
            }
        } finally {
            setSubmitting(false);
        }
    };

    const active = hover || score;

    return (
        <div className="bg-slate-800 rounded-lg p-6">
            <h3 className="text-white font-bold text-lg mb-4">
                {existing ? 'Chỉnh sửa đánh giá' : 'Viết đánh giá'}
            </h3>

            <p className="text-gray-400 text-sm mb-2">Điểm số</p>
            <div className="flex gap-2 flex-wrap mb-4">
                {Array.from({ length: 10 }, (_, i) => i + 1).map(v => (
                    <button
                        key={v}
                        onClick={() => setScore(v)}
                        onMouseEnter={() => setHover(v)}
                        onMouseLeave={() => setHover(0)}
                        className={`px-3 py-1 rounded font-semibold border transition-all cursor-pointer
                            ${v <= active
                                ? 'bg-yellow-400 text-black border-yellow-400 scale-105 shadow-md'
                                : 'bg-slate-700 text-gray-400 border-slate-600'
                            }`}
                    >
                        {v}
                    </button>
                ))}
            </div>

            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                rows={4}
                placeholder="Cảm nghĩ của bạn về bộ phim..."
                className="w-full bg-slate-700 text-white rounded px-3 py-2 mb-4 resize-none"
            />

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <div className="flex gap-3">
                <button
                    onClick={handleSubmit}
                    disabled={submitting || !score || !content.trim()}
                    className="px-5 py-2 rounded bg-yellow-500 text-black font-bold hover:bg-yellow-400 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {submitting ? 'Đang gửi...' : existing ? 'Lưu' : 'Gửi'}
                </button>
                {onCancel && (
                    <button onClick={onCancel} className="px-5 py-2 rounded bg-slate-600 text-white hover:bg-slate-500 transition cursor-pointer">
                        Hủy
                    </button>
                )}
            </div>
        </div>
    );
};

export default ReviewForm;
