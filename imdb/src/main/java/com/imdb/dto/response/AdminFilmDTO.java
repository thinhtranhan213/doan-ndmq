package com.imdb.dto.response;

import java.time.LocalDateTime;

public record AdminFilmDTO(
        Long id,
        Long tmdbId,
        String title,
        Integer releaseYear,
        String status,
        Double averageRating,
        Long voteCount,
        String posterPath,
        LocalDateTime createdAt
) {}