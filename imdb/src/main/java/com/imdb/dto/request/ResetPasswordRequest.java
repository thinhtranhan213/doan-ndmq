package com.imdb.dto.request;

public record ResetPasswordRequest(
        String email,
        String code,
        String newPassword) {
}
