package com.imdb.dto.request;

public record RegisterCommonUserRequest(
        String firstName,
        String lastName,
        String email,
        String password
) {
}
