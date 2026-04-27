package com.imdb.dto.request;

public record UserRoleRequest(
        Long userId,
        String role
) {}