package com.imdb.dto.response;

import java.time.LocalDateTime;

public record AdminReviewDTO(
        Long id,
        Long movieId,
        String authorName,
        String authorEmail,
        String content,
        int rating,
        boolean hidden,
        LocalDateTime createdAt
) {}