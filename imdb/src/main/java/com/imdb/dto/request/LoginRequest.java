package com.imdb.dto.request;

public record LoginRequest(
        String username,
        String password
) {}