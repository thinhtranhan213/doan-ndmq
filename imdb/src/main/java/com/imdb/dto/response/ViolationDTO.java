package com.imdb.dto.response;

import java.time.LocalDateTime;

public record ViolationDTO(
        Long id,
        Long reviewId,
        String reporterEmail,
        String targetUserEmail,
        String reason,
        String status,
        String resolution,
        LocalDateTime createdAt
) {}