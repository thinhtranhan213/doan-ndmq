package com.imdb.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * Response DTO for OTP operations
 * Contains success status, message, and remaining wait time
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class OtpResponse {
    private Boolean success;
    private String message;
    private Long remainingWaitTimeSeconds; // Remaining wait time in seconds before next OTP can be requested

    public OtpResponse(Boolean success, String message) {
        this.success = success;
        this.message = message;
        this.remainingWaitTimeSeconds = 0L;
    }
}
