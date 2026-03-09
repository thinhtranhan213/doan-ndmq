package com.imdb.config.oauth2;

import com.imdb.config.jwt.JwtUtils;
import com.imdb.entity.Role;
import com.imdb.entity.User;
import com.imdb.repository.RoleRepository;
import com.imdb.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final JwtUtils jwtUtils;


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

                    Role roleUser = roleRepository.findByName("ROLE_USER")
                            .orElseThrow(() -> new RuntimeException("Role USER not found"));

                    newUser.getRoles().add(roleUser);

                    return userRepository.save(newUser);
                });


        String token = jwtUtils.generateJwtToken(authentication);

        response.sendRedirect("http://localhost:3000/login-success?token=" + token);
    }
}
