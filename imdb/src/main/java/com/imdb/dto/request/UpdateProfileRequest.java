package com.imdb.dto.request;

public record UpdateProfileRequest(
        String firstName,
        String lastName,
        String email) {
}
