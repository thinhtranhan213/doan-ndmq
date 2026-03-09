package com.imdb.dto.response;

import java.util.List;

public record LoginResponse(
        String accessToken,
        String userName,
        String email,
        List<String> roles
) {}