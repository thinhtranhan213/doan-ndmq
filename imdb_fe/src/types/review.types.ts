export interface UserSummary {
    id: number;
    username: string;
    avatar: string | null;
}

export interface ReviewDto {
    id: number;
    filmId: number;
    user: UserSummary;
    score: number;
    content: string;
    createdAt: string;
    editedAt: string | null;
    isEdited: boolean;
    likeCount: number;
    dislikeCount: number;
    currentUserReaction: 'LIKE' | 'DISLIKE' | 'NONE';
    commentCount: number;
    isOwner: boolean;
}

export interface CommentDto {
    id: number;
    reviewId: number;
    user: UserSummary;
    content: string;
    createdAt: string;
    isEdited: boolean;
    parentCommentId: number | null;
    replies: CommentDto[];
    currentUserIsOwner: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    number: number;
    size: number;
}
