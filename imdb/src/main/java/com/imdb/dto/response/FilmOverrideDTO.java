package com.imdb.dto.response;

import java.time.LocalDateTime;

public record FilmOverrideDTO(
        Long id,
        Long tmdbId,
        String title,
        String posterPath,
        String reason,
        LocalDateTime createdAt
) {}