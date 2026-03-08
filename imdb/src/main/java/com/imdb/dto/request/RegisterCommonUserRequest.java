package com.imdb.dto.request;

public record RegisterCommonUserRequest(
        String userName,
        String email,
        String password
) {
}
