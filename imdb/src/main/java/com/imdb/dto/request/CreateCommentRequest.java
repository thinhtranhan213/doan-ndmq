package com.imdb.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCommentRequest(
        @NotNull Long reviewId,
        @NotBlank String content,
        Long parentCommentId
) {}
