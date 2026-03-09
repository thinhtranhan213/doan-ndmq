package com.imdb.dto.request;

public record LoginRequest(
        String email,
        String password
) {}