import adminAxios from './adminAxios';
import type { AdminReviewDTO, PagedResponse } from '../types/admin.types';

export const getReviews = async (page: number, size: number): Promise<PagedResponse<AdminReviewDTO>> => {
    const res = await adminAxios.get<PagedResponse<AdminReviewDTO>>(`/admin/reviews?page=${page}&size=${size}`);
    return res.data;
};

export const deleteReview = async (id: number): Promise<void> => {
    await adminAxios.delete(`/admin/reviews/${id}`);
};

export const toggleHideReview = async (id: number): Promise<void> => {
    await adminAxios.patch(`/admin/reviews/${id}/hide`);
};