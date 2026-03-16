package com.imdb.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record UserResponse(
        String userName,
        String email,
        String name,
        List<String> roles,
        LocalDateTime createdAt
) {}
