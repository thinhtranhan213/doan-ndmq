package com.imdb.dto.request;

public record FilmOverrideRequest(
        Long tmdbId,
        String title,
        String posterPath,
        String reason
) {}