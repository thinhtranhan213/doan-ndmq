package com.imdb.service.impl;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.RegisterCommonUserRequest;
import com.imdb.dto.response.LoginResponse;
import com.imdb.dto.response.OtpResponse;
import com.imdb.entity.Role;
import com.imdb.entity.User;
import com.imdb.mapper.AuthMapper;
import com.imdb.repository.RoleRepository;
import com.imdb.repository.UserRepository;
import com.imdb.service.IAuthService;
import com.imdb.util.Common;
import com.imdb.util.OtpGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final EmailService emailService;
        private final RoleRepository roleRepository;
        private final JwtUtils jwtUtils;
        private final AuthenticationManager authenticationManager;
        private final AuthMapper authMapper;

        @Override
        public OtpResponse sendOtp(String email) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Email not found"));

                long currentTime = System.currentTimeMillis();

                // Initialize otpAttemptStartTime if not set
                if (user.getOtpAttemptStartTime() == null) {
                        user.setOtpAttemptStartTime(currentTime);
                }

                // Check if 1 hour has passed since first attempt - reset attempts if true
                long timeSinceFirstAttempt = currentTime - user.getOtpAttemptStartTime();
                if (timeSinceFirstAttempt > 3600000) { // 1 hour = 3600000ms
                        user.setOtpAttempts(0);
                        user.setOtpAttemptStartTime(currentTime);
                }

                // Progressive Backoff Logic based on otpAttempts
                // Attempt 1: No wait
                // Attempt 2: Wait 30 seconds
                // Attempt 3: Wait 2 minutes (120 seconds)
                // Attempt 4+: Wait 1 hour

                int attempts = user.getOtpAttempts() != null ? user.getOtpAttempts() : 0;
                long requiredWaitTimeMs = 0;

                if (attempts == 1) {
                        requiredWaitTimeMs = 30000; // 30 seconds
                } else if (attempts == 2) {
                        requiredWaitTimeMs = 120000; // 2 minutes
                } else if (attempts >= 3) {
                        requiredWaitTimeMs = 3600000; // 1 hour
                }

                // Check if enough time has passed since last OTP request
                if (user.getLastOtpSentTime() != null) {
                        long timeSinceLastRequest = currentTime - user.getLastOtpSentTime();
                        if (timeSinceLastRequest < requiredWaitTimeMs) {
                                long remainingWaitTimeMs = requiredWaitTimeMs - timeSinceLastRequest;
                                long remainingWaitTimeSec = (remainingWaitTimeMs + 999) / 1000; // Round up to nearest
                                                                                                // second

                                OtpResponse response = new OtpResponse();
                                response.setSuccess(false);

                                if (attempts == 1) {
                                        response.setMessage("Please wait " + remainingWaitTimeSec
                                                        + " seconds before requesting another OTP");
                                } else if (attempts == 2) {
                                        response.setMessage("Please wait " + remainingWaitTimeSec
                                                        + " seconds before requesting another OTP");
                                } else {
                                        response.setMessage("Too many OTP requests. Please try again in "
                                                        + remainingWaitTimeSec + " seconds");
                                }
                                response.setRemainingWaitTimeSeconds(remainingWaitTimeSec);
                                return response;
                        }
                }

                // Clear old OTP (replace with new one)
                user.setOtp(null);
                user.setOtpExpirationTime(null);

                // Generate and save new OTP
                String otp = OtpGenerator.generateOtp();
                long expirationTime = OtpGenerator.getOtpExpiration();

                user.setOtp(otp);
                user.setOtpExpirationTime(expirationTime);
                user.setLastOtpSentTime(currentTime);
                user.setOtpAttempts(attempts + 1);
                userRepository.save(user);

                // Send OTP email
                emailService.sendOtp(email, otp);

                OtpResponse response = new OtpResponse();
                response.setSuccess(true);
                response.setMessage("OTP has been sent to your email");
                response.setRemainingWaitTimeSeconds(0L);
                return response;
        }

        @Override
        public void verifyOtp(String email, String otp) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Email not found"));

                if (user.getOtp() == null || !user.getOtp().equals(otp)) {
                        throw new RuntimeException("Invalid OTP");
                }

                if (OtpGenerator.isOtpExpired(user.getOtpExpirationTime())) {
                        throw new RuntimeException("OTP has expired");
                }
        }

        @Override
        public void resetPasswordWithOtp(String email, String otp, String newPassword) {
                User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("Email not found"));

                if (user.getOtp() == null || !user.getOtp().equals(otp)) {
                        throw new RuntimeException("Invalid OTP");
                }

                if (OtpGenerator.isOtpExpired(user.getOtpExpirationTime())) {
                        throw new RuntimeException("OTP has expired");
                }

                // Validate password strength
                validatePasswordStrength(newPassword);

                // Set new password
                user.setPassword(passwordEncoder.encode(newPassword));
                user.setOtp(null);
                user.setOtpExpirationTime(null);
                userRepository.save(user);

                // Send password reset confirmation email
                emailService.sendNewPassword(email, newPassword);
        }

        private void validatePasswordStrength(String password) {
                if (password == null || password.length() < 8) {
                        throw new RuntimeException("Password must be at least 8 characters");
                }

                if (!password.matches(".*[a-z].*")) {
                        throw new RuntimeException("Password must contain at least one lowercase letter");
                }

                if (!password.matches(".*[A-Z].*")) {
                        throw new RuntimeException("Password must contain at least one uppercase letter");
                }

                if (!password.matches(".*\\d.*")) {
                        throw new RuntimeException("Password must contain at least one number");
                }
        }

        @Override
        public LoginResponse register(RegisterCommonUserRequest request) {

                if (userRepository.existsByEmail(request.email())) {
                        throw new RuntimeException("Email already exists");
                }

                User user = new User();
                user.setEmail(request.email());
                user.setFirstName(request.firstName());
                user.setLastName(request.lastName());
                user.setPassword(passwordEncoder.encode(request.password()));

                Role roleUser = roleRepository.findByName("ROLE_USER")
                                .orElseThrow(() -> new RuntimeException("Role USER not found"));

                user.getRoles().add(roleUser);

                userRepository.save(user);

                // Auto-login the user after registration
                Authentication authentication = authenticationManager.authenticate(
                                new UsernamePasswordAuthenticationToken(
                                                request.email(),
                                                request.password()));

                String token = jwtUtils.generateJwtToken(authentication);
                CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

                return new LoginResponse(
                                token,
                                userDetails.getUsername(),
                                userDetails.getEmail(),
                                request.firstName(),
                                request.lastName(),
                                userDetails.getAuthorities().stream()
                                                .map(auth -> auth.getAuthority())
                                                .toList());
        }
}
