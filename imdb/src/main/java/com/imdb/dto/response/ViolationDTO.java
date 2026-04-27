package com.imdb.dto.response;

import java.time.LocalDateTime;

public record ViolationDTO(
        Long id,
        Long targetId,
        String targetType,       // "REVIEW" | "COMMENT"
        String reporterEmail,
        String targetUserEmail,
        String reason,           // ReportType + optional description
        String status,
        String resolution,
        LocalDateTime createdAt
) {}
