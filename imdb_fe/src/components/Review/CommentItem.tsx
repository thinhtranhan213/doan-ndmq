import React, { useState } from 'react';
import { CommentDto } from '../../types/review.types';
import { createComment, updateComment, deleteComment } from '../../api/commentService';
import ReportDialog from './ReportDialog';
import ConfirmDeleteDialog from './ConfirmDeleteDialog';

interface Props {
    comment: CommentDto;
    isAuthenticated: boolean;
    onDeleted: (id: number) => void;
    onUpdated: (updated: CommentDto) => void;
    onReplyAdded: (parentId: number, reply: CommentDto) => void;
}

const CommentItem: React.FC<Props> = ({ comment, isAuthenticated, onDeleted, onUpdated, onReplyAdded }) => {
    const [showReplyBox, setShowReplyBox] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [editing, setEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [showReport, setShowReport] = useState(false);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const isDeleted = comment.content === '[Đã xóa]';

    const handleReply = async () => {
        if (!replyContent.trim()) return;
        setSubmitting(true);
        try {
            const reply = await createComment(comment.reviewId, replyContent, comment.id);
            onReplyAdded(comment.id, reply);
            setReplyContent('');
            setShowReplyBox(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async () => {
        if (!editContent.trim()) return;
        setSubmitting(true);
        try {
            const updated = await updateComment(comment.id, editContent);
            onUpdated(updated);
            setEditing(false);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        await deleteComment(comment.id);
        onDeleted(comment.id);
        setShowConfirmDelete(false);
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

    return (
        <div className="mb-3">
            <div className="bg-slate-700 rounded-lg p-3">
                <div className="flex items-center justify-between mb-1">
                    <span className="text-white text-sm font-semibold">{comment.user.username}</span>
                    <span className="text-gray-500 text-xs">{formatDate(comment.createdAt)}{comment.isEdited && ' (đã chỉnh sửa)'}</span>
                </div>

                {editing ? (
                    <div className="mt-2">
                        <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            rows={2}
                            className="w-full bg-slate-600 text-white rounded px-2 py-1 text-sm resize-none mb-2"
                        />
                        <div className="flex gap-2">
                            <button onClick={handleEdit} disabled={submitting} className="text-xs px-3 py-1 rounded bg-yellow-500 text-black font-semibold cursor-pointer hover:bg-yellow-400 disabled:opacity-50">
                                {submitting ? '...' : 'Lưu'}
                            </button>
                            <button onClick={() => setEditing(false)} className="text-xs px-3 py-1 rounded bg-slate-500 text-white cursor-pointer hover:bg-slate-400">
                                Hủy
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className={`text-sm ${isDeleted ? 'text-gray-500 italic' : 'text-gray-300'}`}>
                        {comment.content}
                    </p>
                )}

                {!isDeleted && !editing && (
                    <div className="flex gap-3 mt-2 text-xs text-gray-500">
                        {isAuthenticated && comment.parentCommentId === null && (
                            <button onClick={() => setShowReplyBox(v => !v)} className="hover:text-gray-300 cursor-pointer">
                                Trả lời
                            </button>
                        )}
                        {comment.currentUserIsOwner && (
                            <>
                                <button onClick={() => { setEditing(true); setEditContent(comment.content); }} className="hover:text-gray-300 cursor-pointer">
                                    Sửa
                                </button>
                                <button onClick={() => setShowConfirmDelete(true)} className="hover:text-red-400 cursor-pointer">
                                    Xóa
                                </button>
                            </>
                        )}
                        {isAuthenticated && !comment.currentUserIsOwner && (
                            <button onClick={() => setShowReport(true)} className="hover:text-yellow-400 cursor-pointer">
                                Báo cáo
                            </button>
                        )}
                    </div>
                )}

                {showReplyBox && (
                    <div className="mt-3 flex gap-2">
                        <input
                            value={replyContent}
                            onChange={e => setReplyContent(e.target.value)}
                            placeholder="Viết trả lời..."
                            className="flex-1 bg-slate-600 text-white rounded px-3 py-1 text-sm"
                            onKeyDown={e => e.key === 'Enter' && handleReply()}
                        />
                        <button
                            onClick={handleReply}
                            disabled={submitting || !replyContent.trim()}
                            className="px-3 py-1 rounded bg-yellow-500 text-black text-xs font-semibold cursor-pointer hover:bg-yellow-400 disabled:opacity-50"
                        >
                            Gửi
                        </button>
                    </div>
                )}
            </div>

            {comment.replies && comment.replies.length > 0 && (
                <div className="ml-6 mt-2 space-y-2">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="bg-slate-600/60 rounded-lg p-3">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-white text-sm font-semibold">{reply.user.username}</span>
                                <span className="text-gray-500 text-xs">{formatDate(reply.createdAt)}{reply.isEdited && ' (đã chỉnh sửa)'}</span>
                            </div>
                            <p className={`text-sm ${reply.content === '[Đã xóa]' ? 'text-gray-500 italic' : 'text-gray-300'}`}>
                                {reply.content}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {showReport && <ReportDialog targetId={comment.id} targetType="COMMENT" onClose={() => setShowReport(false)} />}
            {showConfirmDelete && (
                <ConfirmDeleteDialog
                    message="Xóa bình luận này?"
                    onConfirm={handleDelete}
                    onCancel={() => setShowConfirmDelete(false)}
                />
            )}
        </div>
    );
};

export default CommentItem;
