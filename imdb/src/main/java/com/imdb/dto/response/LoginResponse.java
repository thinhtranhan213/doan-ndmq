package com.imdb.dto.response;

import java.util.List;

public record LoginResponse(
        String accessToken,
        String username,
        List<String> roles
) {}