package com.imdb.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateReportRequest(
        @NotNull Long targetId,
        @NotBlank String targetType,  // REVIEW | COMMENT
        @NotBlank String type,        // SPAM | HATE_SPEECH | SPOILER | INAPPROPRIATE | OTHER
        String description
) {}
