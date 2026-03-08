package com.imdb.service.impl;

import com.imdb.dto.request.RegisterCommonUserRequest;
import com.imdb.entity.Role;
import com.imdb.entity.User;
import com.imdb.repository.RoleRepository;
import com.imdb.repository.UserRepository;
import com.imdb.service.IAuthService;
import com.imdb.util.Common;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements IAuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;
    private final RoleRepository roleRepository;

    @Override
    public void forgotPassword(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Email not found"));

        String newPassword = Common.generatePassword();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        emailService.sendNewPassword(email, newPassword);
    }

    @Override
    public void register(RegisterCommonUserRequest request) {
        if(userRepository.existsByUsername(request.userName())){
            throw new RuntimeException("Username already exists");
        }

        if(userRepository.existsByEmail(request.email())){
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setUsername(request.userName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password()));

        Role roleUser = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Role USER not found"));

        user.getRoles().add(roleUser);

        userRepository.save(user);
    }
}
