package com.imdb.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record CommentDto(
        Long id,
        Long reviewId,
        UserSummary user,
        String content,
        LocalDateTime createdAt,
        boolean isEdited,
        Long parentCommentId,
        List<CommentDto> replies,
        boolean currentUserIsOwner
) {}
