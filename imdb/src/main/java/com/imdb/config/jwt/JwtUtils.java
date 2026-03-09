package com.imdb.config.jwt;

import com.imdb.config.user.CustomUserDetails;
import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.time.Instant;
import java.util.Date;
import java.util.List;

@Component
@Slf4j
public class JwtUtils {

    private final Key signingKey;
    private final long expirationMs;

    public JwtUtils(@Value("${jwt.secret}") String secretKey,
                    @Value("${jwt.expiration}") long expirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secretKey));
        this.expirationMs = expirationMs;
    }
    public String generateJwtToken(Authentication authentication) {

        String username;
        List<String> roles;

        Object principal = authentication.getPrincipal();

        if (principal instanceof CustomUserDetails user) {

            username = user.getUsername();
            roles = user.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .toList();

        } else if (principal instanceof OAuth2User oAuth2User) {
            username = oAuth2User.getAttribute("email");
            roles = List.of("ROLE_USER"); // role mặc định
        } else {
            throw new RuntimeException("Unsupported authentication type");
        }

        Instant now = Instant.now();

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(Date.from(now))
                .setExpiration(Date.from(now.plusMillis(expirationMs)))
                .signWith(signingKey, SignatureAlgorithm.HS512)
                .compact();
    }
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .verifyWith((SecretKey) signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token) {
        try {
            extractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.warn("Invalid JWT token");
        }
        return false;
    }

    public String getUsernameFromToken(String token) {
        return extractClaims(token).getSubject();
    }
}