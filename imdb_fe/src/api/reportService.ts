import adminAxios from './adminAxios';

export type ReportTargetType = 'REVIEW' | 'COMMENT';
export type ReportType = 'SPAM' | 'HATE_SPEECH' | 'SPOILER' | 'INAPPROPRIATE' | 'OTHER';

export const createReport = (
    targetId: number,
    targetType: ReportTargetType,
    type: ReportType,
    description?: string,
) =>
    adminAxios.post('/reports', { targetId, targetType, type, description });
