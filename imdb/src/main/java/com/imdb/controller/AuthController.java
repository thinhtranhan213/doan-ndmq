package com.imdb.controller;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.LoginRequest;
import com.imdb.dto.response.LoginResponse;
import com.imdb.mapper.AuthMapper;
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

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()
                )
        );

        CustomUserDetails user =
                (CustomUserDetails) authentication.getPrincipal();

        String token = jwtUtils.generateJwtToken(authentication);

        LoginResponse response = authMapper.toLoginResponse(user);

        return ResponseEntity.ok(
                new LoginResponse(token,
                        response.username(),
                        response.roles())
        );
    }
}