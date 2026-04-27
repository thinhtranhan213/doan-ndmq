import adminAxios from './adminAxios';
import { ReviewDto, PageResponse } from '../types/review.types';

export const createReview = (filmId: number, score: number, content: string) =>
    adminAxios.post<ReviewDto>('/reviews', { filmId, score, content }).then(r => r.data);

export const getReviewsByFilm = (filmId: number, page = 0, size = 10, sort?: string) =>
    adminAxios.get<PageResponse<ReviewDto>>(`/reviews/film/${filmId}`, {
        params: { page, size, sort },
    }).then(r => r.data);

export const getMyReview = (filmId: number) =>
    adminAxios.get<ReviewDto>(`/reviews/film/${filmId}/my`).then(r => r.data);

export const getScoreDistribution = (filmId: number) =>
    adminAxios.get<Record<number, number>>(`/reviews/film/${filmId}/score-distribution`).then(r => r.data);

export const updateReview = (reviewId: number, score: number, content: string) =>
    adminAxios.put<ReviewDto>(`/reviews/${reviewId}`, { score, content }).then(r => r.data);

export const deleteReview = (reviewId: number) =>
    adminAxios.delete(`/reviews/${reviewId}`);

export const toggleReaction = (reviewId: number, type: 'LIKE' | 'DISLIKE') =>
    adminAxios.post<ReviewDto>(`/reviews/${reviewId}/react`, null, { params: { type } }).then(r => r.data);
