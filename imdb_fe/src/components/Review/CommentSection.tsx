import React, { useEffect, useState } from 'react';
import { CommentDto } from '../../types/review.types';
import { getComments, createComment } from '../../api/commentService';
import CommentItem from './CommentItem';

interface Props {
    reviewId: number;
    isAuthenticated: boolean;
}

const CommentSection: React.FC<Props> = ({ reviewId, isAuthenticated }) => {
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(false);

    const load = async (p = 0) => {
        setLoading(true);
        try {
            const res = await getComments(reviewId, p, 10);
            setComments(prev => p === 0 ? res.content : [...prev, ...res.content]);
            setHasMore(p + 1 < res.totalPages);
            setPage(p);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(0); }, [reviewId]);

    const handleSubmit = async () => {
        if (!newComment.trim()) return;
        setSubmitting(true);
        try {
            const comment = await createComment(reviewId, newComment);
            setComments(prev => [comment, ...prev]);
            setNewComment('');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleted = (id: number) => {
        setComments(prev => prev.map(c =>
            c.id === id ? { ...c, content: '[Đã xóa]' } : c
        ));
    };

    const handleUpdated = (updated: CommentDto) => {
        setComments(prev => prev.map(c => c.id === updated.id ? updated : c));
    };

    const handleReplyAdded = (parentId: number, reply: CommentDto) => {
        setComments(prev => prev.map(c =>
            c.id === parentId ? { ...c, replies: [...(c.replies || []), reply] } : c
        ));
    };

    return (
        <div className="mt-4">
            <h4 className="text-white font-semibold mb-3 text-sm">Bình luận ({comments.length})</h4>

            {isAuthenticated && (
                <div className="flex gap-2 mb-4">
                    <input
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Viết bình luận..."
                        className="flex-1 bg-slate-700 text-white rounded px-3 py-2 text-sm"
                        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                    />
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !newComment.trim()}
                        className="px-4 py-2 rounded bg-yellow-500 text-black text-sm font-semibold cursor-pointer hover:bg-yellow-400 disabled:opacity-50"
                    >
                        Gửi
                    </button>
                </div>
            )}

            {loading && comments.length === 0 && (
                <p className="text-gray-500 text-sm">Đang tải...</p>
            )}

            {comments.map(c => (
                <CommentItem
                    key={c.id}
                    comment={c}
                    isAuthenticated={isAuthenticated}
                    onDeleted={handleDeleted}
                    onUpdated={handleUpdated}
                    onReplyAdded={handleReplyAdded}
                />
            ))}

            {hasMore && (
                <button
                    onClick={() => load(page + 1)}
                    className="text-sm text-gray-400 hover:text-white mt-2 cursor-pointer"
                >
                    Xem thêm bình luận...
                </button>
            )}
        </div>
    );
};

export default CommentSection;
