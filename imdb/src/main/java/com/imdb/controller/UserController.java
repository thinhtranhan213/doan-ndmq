package com.imdb.controller;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.ChangePasswordRequest;
import com.imdb.dto.request.UpdateProfileRequest;
import com.imdb.dto.response.LoginResponse;
import com.imdb.dto.response.ProfileResponse;
import com.imdb.dto.response.MessageResponse;
import com.imdb.entity.User;
import com.imdb.repository.UserRepository;
import com.imdb.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;

    @GetMapping("/me")
    public ResponseEntity<?> currentUser(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof CustomUserDetails) {
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            User user = userRepository.findByEmail(userDetails.getEmail())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<String> roles = userDetails.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .collect(Collectors.toList());

            // Check if user has a password (password is not null and not empty)
            boolean hasPassword = user.getPassword() != null && !user.getPassword().isEmpty();

            ProfileResponse.UserProfileInfo userInfo = new ProfileResponse.UserProfileInfo(
                    userDetails.getEmail(),
                    user.getFirstName(),
                    user.getLastName(),
                    user.getCreatedAt(),
                    roles,
                    hasPassword);

            return ResponseEntity.ok(new ProfileResponse(userInfo));
        }
        return ResponseEntity.badRequest().body("User not found or not authenticated");
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordRequest request) {
        try {
            userService.changePassword(request);
            return ResponseEntity.ok(new MessageResponse("Password changed successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @RequestBody UpdateProfileRequest request,
            Authentication authentication) {

        if (authentication == null || !(authentication.getPrincipal() instanceof CustomUserDetails)) {
            return ResponseEntity.badRequest().body(new MessageResponse("User not authenticated"));
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        userService.updateProfile(userDetails.getEmail(), request);

        return ResponseEntity.ok(new MessageResponse("Profile updated successfully"));
    }
}
