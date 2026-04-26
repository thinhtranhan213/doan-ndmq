import adminAxios from './adminAxios';
import type { UserAdminDTO, UserStatusRequest, UserRoleRequest, PagedResponse } from '../types/admin.types';

export const getUsers = async (
    page: number,
    size: number,
    filters: { status?: string; role?: string; search?: string }
): Promise<PagedResponse<UserAdminDTO>> => {
    const params = new URLSearchParams({ page: String(page), size: String(size) });
    if (filters.status) params.set('status', filters.status);
    if (filters.role)   params.set('role',   filters.role);
    if (filters.search) params.set('search', filters.search);
    const res = await adminAxios.get<PagedResponse<UserAdminDTO>>(`/admin/users?${params}`);
    return res.data;
};

export const getUserById = async (id: number): Promise<UserAdminDTO> => {
    const res = await adminAxios.get<UserAdminDTO>(`/admin/users/${id}`);
    return res.data;
};

export const updateUserStatus = async (id: number, request: UserStatusRequest): Promise<void> => {
    await adminAxios.patch(`/admin/users/${id}/status`, request);
};

export const updateUserRole = async (id: number, request: UserRoleRequest): Promise<void> => {
    await adminAxios.patch(`/admin/users/${id}/role`, request);
};