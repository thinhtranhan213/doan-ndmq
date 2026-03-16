package com.imdb.service.impl;

import com.imdb.dto.request.ChangePasswordRequest;
import com.imdb.dto.request.UpdateProfileRequest;
import com.imdb.entity.User;
import com.imdb.repository.UserRepository;
import com.imdb.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void changePassword(ChangePasswordRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = null;
        if (authentication != null) {
            email = authentication.getName();
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Chỉ kiểm tra password cũ nếu user đã có password (không phải OAuth2)
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
                throw new RuntimeException("Old password is incorrect");
            }
        }

        // Validate password strength
        validatePasswordStrength(request.newPassword());

        // encode password mới
        user.setPassword(passwordEncoder.encode(request.newPassword()));

        userRepository.save(user);
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
    public void updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.firstName() != null && !request.firstName().isEmpty()) {
            user.setFirstName(request.firstName());
        }

        if (request.lastName() != null && !request.lastName().isEmpty()) {
            user.setLastName(request.lastName());
        }

        userRepository.save(user);
    }
}
