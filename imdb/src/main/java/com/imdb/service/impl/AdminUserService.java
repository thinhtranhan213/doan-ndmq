package com.imdb.service.impl;

import com.imdb.dto.request.UserRoleRequest;
import com.imdb.dto.request.UserStatusRequest;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.UserAdminDTO;
import com.imdb.entity.Role;
import com.imdb.entity.User;
import com.imdb.entity.UserStatus;
import com.imdb.repository.ReviewRepository;
import com.imdb.repository.RoleRepository;
import com.imdb.repository.UserRepository;
import com.imdb.service.IAdminUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminUserService implements IAdminUserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final ReviewRepository reviewRepository;

    @Override
    public PagedResponse<UserAdminDTO> getUsers(int page, int size, String status, String role, String search) {
        UserStatus statusEnum = (status != null && !status.isBlank())
                ? UserStatus.valueOf(status.toUpperCase()) : null;
        String roleParam  = (role   != null && !role.isBlank())   ? role   : null;
        String searchParam = (search != null && !search.isBlank()) ? search : null;

        Page<User> userPage = userRepository.findUsersWithFilters(
                statusEnum, roleParam, searchParam,
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        List<UserAdminDTO> data = userPage.getContent().stream()
                .map(this::toDTO)
                .toList();

        return new PagedResponse<>(data, userPage.getNumber(), userPage.getSize(),
                userPage.getTotalElements(), userPage.getTotalPages());
    }

    @Override
    public UserAdminDTO getUserById(Long id) {
        User user = findUserOrThrow(id);
        return toDTO(user);
    }

    @Override
    @Transactional
    public void updateUserStatus(Long id, UserStatusRequest request) {
        User user = findUserOrThrow(id);
        UserStatus newStatus = UserStatus.valueOf(request.status().toUpperCase());
        String admin = currentAdminEmail();

        log.info("[ADMIN ACTION] admin={} | action=CHANGE_STATUS | userId={} | email={} | {} -> {} | reason={} | time={}",
                admin, id, user.getEmail(), user.getStatus(), newStatus, request.reason(), LocalDateTime.now());

        user.setStatus(newStatus);
        user.setEnabled(newStatus == UserStatus.ACTIVE);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void updateUserRole(Long id, UserRoleRequest request) {
        User user = findUserOrThrow(id);
        String roleName = request.role().startsWith("ROLE_") ? request.role() : "ROLE_" + request.role();
        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));

        String admin = currentAdminEmail();
        String oldRoles = user.getRoles().stream().map(Role::getName).collect(Collectors.joining(","));

        log.info("[ADMIN ACTION] admin={} | action=CHANGE_ROLE | userId={} | email={} | {} -> {} | time={}",
                admin, id, user.getEmail(), oldRoles, roleName, LocalDateTime.now());

        user.getRoles().clear();
        user.getRoles().add(role);
        userRepository.save(user);
    }


    // ---- helpers ----

    private User findUserOrThrow(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
    }

    private String currentAdminEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private UserAdminDTO toDTO(User user) {
        String primaryRole = user.getRoles().stream()
                .map(Role::getName)
                .findFirst()
                .orElse("ROLE_USER");

        return new UserAdminDTO(
                user.getId(),
                user.getFullName(),
                user.getEmail(),
                primaryRole,
                user.getStatus() != null ? user.getStatus().name() : UserStatus.ACTIVE.name(),
                user.getCreatedAt(),
                reviewRepository.countByUserId(user.getId()));
    }
}