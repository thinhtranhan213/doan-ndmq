package com.imdb.service.impl;

import com.imdb.dto.request.ViolationActionRequest;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.ViolationDTO;
import com.imdb.entity.*;
import com.imdb.repository.ReviewRepository;
import com.imdb.repository.UserRepository;
import com.imdb.repository.ViolationRepository;
import com.imdb.service.IAdminViolationService;
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

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminViolationService implements IAdminViolationService {

    private final ViolationRepository violationRepository;
    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    @Override
    public PagedResponse<ViolationDTO> getViolations(int page, int size, String status) {
        Page<Violation> violationPage;
        if (status != null && !status.isBlank()) {
            ViolationStatus st = ViolationStatus.valueOf(status.toUpperCase());
            violationPage = violationRepository.findByStatus(st,
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        } else {
            violationPage = violationRepository.findAll(
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        }

        List<ViolationDTO> data = violationPage.getContent().stream().map(this::toDTO).toList();
        return new PagedResponse<>(data, violationPage.getNumber(), violationPage.getSize(),
                violationPage.getTotalElements(), violationPage.getTotalPages());
    }

    @Override
    @Transactional
    public void ignore(Long id, ViolationActionRequest request) {
        resolve(id, ViolationStatus.IGNORED, request.resolution(), "IGNORE_VIOLATION");
    }

    @Override
    @Transactional
    public void removeContent(Long id, ViolationActionRequest request) {
        Violation v = resolve(id, ViolationStatus.RESOLVED, request.resolution(), "REMOVE_CONTENT");
        if (v.getReviewId() != null) {
            reviewRepository.findById(v.getReviewId()).ifPresent(reviewRepository::delete);
        }
    }

    @Override
    @Transactional
    public void warnUser(Long id, ViolationActionRequest request) {
        Violation v = resolve(id, ViolationStatus.RESOLVED, request.resolution(), "WARN_USER");
        if (v.getTargetUser() != null) {
            User target = v.getTargetUser();
            target.setStatus(UserStatus.WARNING);
            userRepository.save(target);
        }
    }

    @Override
    @Transactional
    public void banUser(Long id, ViolationActionRequest request) {
        Violation v = resolve(id, ViolationStatus.RESOLVED, request.resolution(), "BAN_USER");
        if (v.getTargetUser() != null) {
            User target = v.getTargetUser();
            target.setStatus(UserStatus.BANNED);
            target.setEnabled(false);
            userRepository.save(target);
        }
    }

    @Override
    public long countPending() {
        return violationRepository.countByStatus(ViolationStatus.PENDING);
    }

    private Violation resolve(Long id, ViolationStatus newStatus, String resolution, String action) {
        Violation v = violationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Violation not found: " + id));
        v.setStatus(newStatus);
        v.setResolution(resolution);
        violationRepository.save(v);
        log.info("[ADMIN ACTION] admin={} | action={} | violationId={} | time={}",
                adminEmail(), action, id, LocalDateTime.now());
        return v;
    }

    private String adminEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private ViolationDTO toDTO(Violation v) {
        return new ViolationDTO(
                v.getId(), v.getReviewId(),
                v.getReporter()    != null ? v.getReporter().getEmail()    : "—",
                v.getTargetUser()  != null ? v.getTargetUser().getEmail()  : "—",
                v.getReason(), v.getStatus().name(), v.getResolution(),
                v.getCreatedAt());
    }
}