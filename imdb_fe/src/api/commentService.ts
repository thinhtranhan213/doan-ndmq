import adminAxios from './adminAxios';
import { CommentDto, PageResponse } from '../types/review.types';

export const createComment = (reviewId: number, content: string, parentCommentId?: number) =>
    adminAxios.post<CommentDto>('/comments', { reviewId, content, parentCommentId }).then(r => r.data);

export const getComments = (reviewId: number, page = 0, size = 20) =>
    adminAxios.get<PageResponse<CommentDto>>(`/comments/review/${reviewId}`, {
        params: { page, size },
    }).then(r => r.data);

export const updateComment = (commentId: number, content: string) =>
    adminAxios.put<CommentDto>(`/comments/${commentId}`, { content }).then(r => r.data);

export const deleteComment = (commentId: number) =>
    adminAxios.delete(`/comments/${commentId}`);
