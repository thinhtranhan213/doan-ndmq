package com.imdb.controller;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.ChangePasswordRequest;
import com.imdb.dto.request.UpdateProfileRequest;
import com.imdb.dto.response.*;
import com.imdb.entity.User;
import com.imdb.repository.UserRepository;
import com.imdb.service.IReviewService;
import com.imdb.service.IUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final IUserService userService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final IReviewService reviewService;

    @GetMapping("/me")
    public ResponseEntity<ProfileResponse> currentUser(Authentication authentication) {
        if (authentication.getPrincipal() instanceof CustomUserDetails userDetails) {
            return ResponseEntity.ok(userService.getProfile(userDetails));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
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
