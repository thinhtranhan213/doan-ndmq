import React, { useState } from 'react';
import { ReviewDto } from '../../types/review.types';
import { toggleReaction, deleteReview } from '../../api/reviewService';
import ReviewForm from './ReviewForm';
import CommentSection from './CommentSection';
import ReportDialog from './ReportDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface Props {
    review: ReviewDto;
    isAuthenticated: boolean;
    onDeleted: (id: number) => void;
    onUpdated: (updated: ReviewDto) => void;
}

const ReviewCard: React.FC<Props> = ({ review, isAuthenticated, onDeleted, onUpdated }) => {
    const [data, setData] = useState(review);
    const [showComments, setShowComments] = useState(false);
    const [editing, setEditing] = useState(false);
    const [showReport, setShowReport] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [reacting, setReacting] = useState(false);

    const isOwner = data.isOwner;

    const handleReact = async (type: 'LIKE' | 'DISLIKE') => {
        if (!isAuthenticated || reacting) return;
        setReacting(true);
        try {
            const updated = await toggleReaction(data.id, type);
            setData(updated);
        } finally {
            setReacting(false);
        }
    };

    const handleDelete = async () => {
        await deleteReview(data.id);
        onDeleted(data.id);
        setShowConfirmDelete(false);
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    const stars = Array.from({ length: 10 }, (_, i) => i + 1);

    if (editing) {
        return (
            <ReviewForm
                filmId={data.filmId}
                existing={data}
                onSaved={updated => { setData(updated); onUpdated(updated); setEditing(false); }}
                onCancel={() => setEditing(false)}
            />
        );
    }

    return (
        <div className="bg-slate-800 rounded-lg p-5 mb-4">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-600 flex items-center justify-center text-white font-bold text-sm">
                        {data.user.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-semibold text-sm">{data.user.username}</p>
                        <p className="text-gray-500 text-xs">
                            {formatDate(data.createdAt)}{data.isEdited && ' (đã chỉnh sửa)'}
                        </p>
                    </div>
                </div>
                <div className="bg-yellow-500 text-black font-bold px-3 py-1 rounded text-sm">
                    ⭐ {data.score}/10
                </div>
            </div>

            {/* Score bar */}
            <div className="flex gap-1 mb-3">
                {stars.map(v => (
                    <div
                        key={v}
                        className={`h-1.5 flex-1 rounded-full ${v <= data.score ? 'bg-yellow-400' : 'bg-slate-600'}`}
                    />
                ))}
            </div>

            {/* Content */}
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{data.content}</p>

            {/* Actions */}
            <div className="flex items-center gap-4 text-sm">
                <button
                    onClick={() => handleReact('LIKE')}
                    disabled={!isAuthenticated || reacting}
                    className={`flex items-center gap-1 transition cursor-pointer disabled:cursor-default
                        ${data.currentUserReaction === 'LIKE' ? 'text-green-400' : 'text-gray-400 hover:text-green-400'}`}
                >
                    👍 {data.likeCount}
                </button>
                <button
                    onClick={() => handleReact('DISLIKE')}
                    disabled={!isAuthenticated || reacting}
                    className={`flex items-center gap-1 transition cursor-pointer disabled:cursor-default
                        ${data.currentUserReaction === 'DISLIKE' ? 'text-red-400' : 'text-gray-400 hover:text-red-400'}`}
                >
                    👎 {data.dislikeCount}
                </button>
                <button
                    onClick={() => setShowComments(v => !v)}
                    className="text-gray-400 hover:text-white transition cursor-pointer"
                >
                    💬 {data.commentCount}
                </button>

                <div className="ml-auto flex gap-3">
                    {isOwner && (
                        <>
                            <button onClick={() => setEditing(true)} className="text-gray-400 hover:text-white cursor-pointer">
                                Sửa
                            </button>
                            <button onClick={() => setShowConfirmDelete(true)} className="text-gray-400 hover:text-red-400 cursor-pointer">
                                Xóa
                            </button>
                        </>
                    )}
                    {isAuthenticated && !isOwner && (
                        <button onClick={() => setShowReport(true)} className="text-gray-400 hover:text-yellow-400 cursor-pointer">
                            Báo cáo
                        </button>
                    )}
                </div>
            </div>

            {showComments && (
                <div className="mt-4 border-t border-slate-700 pt-4">
                    <CommentSection reviewId={data.id} isAuthenticated={isAuthenticated} />
                </div>
            )}

            {showReport && <ReportDialog targetId={data.id} targetType="REVIEW" onClose={() => setShowReport(false)} />}
            {showConfirmDelete && (
                <ConfirmDeleteDialog
                    message="Xóa đánh giá này? Hành động không thể hoàn tác."
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            )}
        </div>
    );
};

export default ReviewCard;
