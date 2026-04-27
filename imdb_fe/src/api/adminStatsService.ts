import adminAxios from './adminAxios';
import type { DashboardStats } from '../types/admin.types';

export const getDashboardStats = async (): Promise<DashboardStats> => {
    const res = await adminAxios.get<DashboardStats>('/admin/stats/overview');
    return res.data;
};

export const getPendingViolationCount = async (): Promise<number> => {
    const res = await adminAxios.get<{ count: number }>('/admin/stats/pending-violations');
    return res.data.count;
};