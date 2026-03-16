package com.imdb.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record ProfileResponse(
                UserProfileInfo user) {
        public record UserProfileInfo(
                        String email,
                        String firstName,
                        String lastName,
                        LocalDateTime createdAt,
                        List<String> roles,
                        Boolean hasPassword) {
        }
}
