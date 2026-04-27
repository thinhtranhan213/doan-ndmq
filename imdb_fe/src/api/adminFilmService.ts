import adminAxios from './adminAxios';
import axios from 'axios';
import type { FilmOverrideDTO, FilmOverrideRequest, PagedResponse } from '../types/admin.types';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const getBlacklist = async (page: number, size: number): Promise<PagedResponse<FilmOverrideDTO>> => {
    const res = await adminAxios.get<PagedResponse<FilmOverrideDTO>>(`/admin/films?page=${page}&size=${size}`);
    return res.data;
};

export const addToBlacklist = async (request: FilmOverrideRequest): Promise<FilmOverrideDTO> => {
    const res = await adminAxios.post<FilmOverrideDTO>('/admin/films', request);
    return res.data;
};

export const removeFromBlacklist = async (id: number): Promise<void> => {
    await adminAxios.delete(`/admin/films/${id}`);
};

/** Lấy danh sách tmdbId bị ẩn — dùng để filter kết quả TMDB trên frontend */
export const getBlacklistedIds = async (): Promise<number[]> => {
    const res = await axios.get<number[]>(`${API_BASE}/public/films/blacklist`);
    return res.data;
};