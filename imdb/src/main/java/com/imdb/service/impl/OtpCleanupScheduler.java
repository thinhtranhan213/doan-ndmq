package com.imdb.service.impl;

import com.imdb.entity.User;
import com.imdb.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Scheduled task to clean up expired OTPs from the database
 * - Runs every 10 minutes
 * - Removes OTP and otpExpirationTime for users whose OTP has expired
 * - Helps keep the database clean and prevents accumulation of stale OTPs
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OtpCleanupScheduler {

    private final UserRepository userRepository;

    /**
     * Clean up expired OTPs every 10 minutes (600000ms)
     * This prevents stale OTP data from accumulating in the database
     */
    @Scheduled(fixedDelay = 600000) // 10 minutes
    public void cleanupExpiredOtps() {
        try {
            long currentTime = System.currentTimeMillis();

            // Find all users with OTP that has expired
            List<User> usersWithExpiredOtp = userRepository.findAll().stream()
                    .filter(user -> user.getOtp() != null &&
                            user.getOtpExpirationTime() != null &&
                            user.getOtpExpirationTime() < currentTime)
                    .toList();

            if (!usersWithExpiredOtp.isEmpty()) {
                // Clear expired OTPs
                usersWithExpiredOtp.forEach(user -> {
                    user.setOtp(null);
                    user.setOtpExpirationTime(null);
                });

                userRepository.saveAll(usersWithExpiredOtp);
                log.info("Cleaned up {} expired OTPs from the database", usersWithExpiredOtp.size());
            }
        } catch (Exception e) {
            log.error("Error while cleaning up expired OTPs: {}", e.getMessage(), e);
        }
    }

    /**
     * Reset OTP attempts every hour (3600000ms)
     * This allows users to request OTPs again after 1 hour
     */
    @Scheduled(fixedDelay = 3600000) // 1 hour
    public void resetOtpAttempts() {
        try {
            List<User> usersWithAttempts = userRepository.findAll().stream()
                    .filter(user -> user.getOtpAttempts() != null && user.getOtpAttempts() > 0)
                    .toList();

            if (!usersWithAttempts.isEmpty()) {
                usersWithAttempts.forEach(user -> user.setOtpAttempts(0));
                userRepository.saveAll(usersWithAttempts);
                log.info("Reset OTP attempts for {} users", usersWithAttempts.size());
            }
        } catch (Exception e) {
            log.error("Error while resetting OTP attempts: {}", e.getMessage(), e);
        }
    }
}
