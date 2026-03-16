package com.imdb.controller;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.ForgotPasswordRequest;
import com.imdb.dto.request.LoginRequest;
import com.imdb.dto.request.RegisterCommonUserRequest;
import com.imdb.dto.request.ResetPasswordRequest;
import com.imdb.dto.request.VerifyOtpRequest;
import com.imdb.dto.response.LoginResponse;
import com.imdb.dto.response.OtpResponse;
import com.imdb.dto.response.PasswordResponse;
import com.imdb.mapper.AuthMapper;
import com.imdb.service.impl.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtils jwtUtils;
    private final AuthMapper authMapper;
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.password()));

        CustomUserDetails user = (CustomUserDetails) authentication.getPrincipal();

        String token = jwtUtils.generateJwtToken(authentication);

        return ResponseEntity.ok(new LoginResponse(
                token,
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getAuthorities().stream()
                        .map(auth -> auth.getAuthority())
                        .toList()));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<OtpResponse> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        OtpResponse response = authService.sendOtp(request.email());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/verify-reset-code")
    public ResponseEntity<PasswordResponse> verifyResetCode(@RequestBody VerifyOtpRequest request) {
        authService.verifyOtp(request.email(), request.code());
        return ResponseEntity.ok(new PasswordResponse("OTP verified successfully", true));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<PasswordResponse> resetPassword(@RequestBody ResetPasswordRequest request) {
        authService.resetPasswordWithOtp(request.email(), request.code(), request.newPassword());
        return ResponseEntity.ok(new PasswordResponse("Password has been reset successfully", true));
    }

    @PostMapping("/register")
    public ResponseEntity<LoginResponse> register(@RequestBody RegisterCommonUserRequest request) {
        LoginResponse response = authService.register(request);
        return ResponseEntity.ok(response);
    }
}