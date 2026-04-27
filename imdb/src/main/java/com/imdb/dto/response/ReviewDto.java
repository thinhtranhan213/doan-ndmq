package com.imdb.dto.response;

import java.time.LocalDateTime;

public record ReviewDto(
        Long id,
        Long filmId,
        UserSummary user,
        Integer score,
        String content,
        LocalDateTime createdAt,
        LocalDateTime editedAt,
        boolean isEdited,
        int likeCount,
        int dislikeCount,
        String currentUserReaction,   // "LIKE" | "DISLIKE" | "NONE"
        long commentCount,
        boolean isOwner
) {}
