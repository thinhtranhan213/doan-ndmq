package com.imdb.dto.request;

public record UserStatusRequest(
        Long userId,
        String status,
        String reason
) {}