package com.imdb.config.oauth2;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.entity.Role;
import com.imdb.entity.User;
import com.imdb.repository.RoleRepository;
import com.imdb.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtils jwtUtils;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication) throws IOException {

        OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");

        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setEmail(email);
                    newUser.setFirstName(name);
                    newUser.setProvider(User.Provider.GOOGLE);

                    // Find or create ROLE_USER
                    Role roleUser = roleRepository.findByName("ROLE_USER")
                            .orElseGet(() -> {
                                Role newRole = new Role();
                                newRole.setName("ROLE_USER");
                                return roleRepository.save(newRole);
                            });

                    newUser.getRoles().add(roleUser);

                    return userRepository.save(newUser);
                });

        if (Boolean.FALSE.equals(user.getEnabled())) {
            String loginUrl = UriComponentsBuilder.fromUriString(frontendUrl + "/login")
                    .queryParam("error", "account_banned")
                    .build()
                    .toUriString();
            response.sendRedirect(loginUrl);
            return;
        }

        String token = jwtUtils.generateJwtToken(authentication);

        // Use configured frontend URL (fallback to detecting from referer if available)
        String baseUrl = frontendUrl;
        String referer = request.getHeader("referer");
        if (referer != null && referer.contains("localhost")) {
            try {
                int lastColonIndex = referer.lastIndexOf(":");
                int slashIndex = referer.indexOf("/", lastColonIndex);
                if (lastColonIndex != -1 && slashIndex != -1) {
                    String port = referer.substring(lastColonIndex + 1, slashIndex);
                    if (port.matches("\\d+")) {
                        baseUrl = "http://localhost:" + port;
                    }
                }
            } catch (Exception e) {
                // Fallback to configured frontend URL
            }
        }

        // Build redirect URL with user info
        String redirectUrl = UriComponentsBuilder.fromUriString(baseUrl + "/login-success")
                .queryParam("token", token)
                .queryParam("user", encodeUserInfo(user))
                .build()
                .toUriString();

        response.sendRedirect(redirectUrl);
    }

    private String encodeUserInfo(User user) {
        String userInfo = String.format("%s|%s|%s",
                user.getId(),
                user.getEmail(),
                user.getFirstName() != null ? user.getFirstName() : "");
        return URLEncoder.encode(userInfo, StandardCharsets.UTF_8);
    }
}
