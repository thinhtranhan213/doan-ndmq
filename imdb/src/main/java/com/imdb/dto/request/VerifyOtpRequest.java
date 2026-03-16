package com.imdb.dto.request;

public record VerifyOtpRequest(
        String email,
        String code) {
}
