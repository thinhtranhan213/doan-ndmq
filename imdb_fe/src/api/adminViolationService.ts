import adminAxios from './adminAxios';
import type { ViolationDTO, PagedResponse } from '../types/admin.types';

export const getViolations = async (
    page: number, size: number, status?: string
): Promise<PagedResponse<ViolationDTO>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (status) params.set('status', status);
    const res = await adminAxios.get<PagedResponse<ViolationDTO>>(`/admin/violations?${params}`);
    return res.data;
};

export const ignoreViolation     = async (id: number, resolution?: string) =>
    adminAxios.patch(`/admin/violations/${id}/ignore`,         { resolution });
export const removeContent       = async (id: number, resolution?: string) =>
    adminAxios.patch(`/admin/violations/${id}/remove-content`, { resolution });
export const warnUser            = async (id: number, resolution?: string) =>
    adminAxios.patch(`/admin/violations/${id}/warn-user`,      { resolution });
export const banUserViaViolation = async (id: number, resolution?: string) =>
    adminAxios.patch(`/admin/violations/${id}/ban-user`,       { resolution });