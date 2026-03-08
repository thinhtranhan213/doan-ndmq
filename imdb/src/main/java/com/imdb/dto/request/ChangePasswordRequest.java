package com.imdb.dto.request;

public record ChangePasswordRequest(
        String oldPassword,
        String newPassword
) {
}
