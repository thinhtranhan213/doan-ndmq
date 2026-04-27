// ---- Shared ----
export interface PagedResponse<T> {
    data: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
}

// ---- Users ----
export type UserStatus = 'ACTIVE' | 'WARNING' | 'BANNED';
export type UserRole   = 'ROLE_USER' | 'ROLE_ADMIN';

export interface UserAdminDTO {
    id: number;
    username: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    createdAt: string;
    reviewCount: number;
}

export interface UserStatusRequest { userId: number; status: UserStatus; reason: string }
export interface UserRoleRequest   { userId: number; role: UserRole }

export interface UserFilters {
    status: UserStatus | '';
    role: UserRole | '';
    search: string;
}

// ---- Dashboard ----
export interface DayStat { date: string; count: number }

export interface DashboardStats {
    totalUsers: number;
    activeUsers: number;
    warningUsers: number;
    bannedUsers: number;
    totalReviews: number;
    hiddenReviews: number;
    totalFilms: number;
    hiddenFilmsCount: number;
    totalViolations: number;
    pendingViolations: number;
    ignoredViolations: number;
    resolvedViolations: number;
    newUsersThisWeek: number;
    userChart: DayStat[];
    reviewChart: DayStat[];
    violationChart: DayStat[];
}

// ---- Reviews ----
export interface AdminReviewDTO {
    id: number;
    movieId: number;
    authorName: string;
    authorEmail: string;
    content: string;
    rating: number;
    hidden: boolean;
    createdAt: string;
}

// ---- Films (blacklist of TMDB IDs) ----
export interface FilmOverrideDTO {
    id: number;
    tmdbId: number;
    title: string;
    posterPath: string | null;
    reason: string | null;
    createdAt: string;
}

export interface FilmOverrideRequest {
    tmdbId: number;
    title: string;
    posterPath?: string;
    reason: string;
}

// ---- Violations ----
export type ViolationStatus = 'PENDING' | 'IGNORED' | 'RESOLVED';

export interface ViolationDTO {
    id: number;
    reviewId: number | null;
    reporterEmail: string;
    targetUserEmail: string;
    reason: string;
    status: ViolationStatus;
    resolution: string | null;
    createdAt: string;
}