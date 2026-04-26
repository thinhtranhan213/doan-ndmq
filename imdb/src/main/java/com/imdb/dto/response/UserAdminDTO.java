package com.imdb.dto.response;

import java.time.LocalDateTime;

public record UserAdminDTO(
        Long id,
        String username,
        String email,
        String role,
        String status,
        LocalDateTime createdAt,
        int reviewCount
) {}