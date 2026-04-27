package com.imdb.service.impl;

import com.imdb.dto.request.ViolationActionRequest;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.ViolationDTO;
import com.imdb.entity.*;
import com.imdb.repository.CommentRepository;
import com.imdb.repository.ReportRepository;
import com.imdb.repository.ReviewRepository;
import com.imdb.repository.UserRepository;
import com.imdb.service.IAdminViolationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminViolationService implements IAdminViolationService {

    private final ReportRepository reportRepo;
    private final ReviewRepository reviewRepo;
    private final CommentRepository commentRepo;
    private final UserRepository userRepo;

    @Override
    public PagedResponse<ViolationDTO> getViolations(int page, int size, String status) {
        Page<Report> reportPage;
        if (status != null && !status.isBlank()) {
            ReportStatus st = ReportStatus.valueOf(status.toUpperCase());
            reportPage = reportRepo.findByStatus(st,
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        } else {
            reportPage = reportRepo.findAll(
                    PageRequest.of(page, size, Sort.by("createdAt").descending()));
        }

        List<ViolationDTO> data = reportPage.getContent().stream().map(this::toDTO).toList();
        return new PagedResponse<>(data, reportPage.getNumber(), reportPage.getSize(),
                reportPage.getTotalElements(), reportPage.getTotalPages());
    }

    @Override
    @Transactional
    public void ignore(Long id, ViolationActionRequest request) {
        resolve(id, ReportStatus.IGNORED, request.resolution());
    }

    @Override
    @Transactional
    public void removeContent(Long id, ViolationActionRequest request) {
        Report report = resolve(id, ReportStatus.RESOLVED, request.resolution());
        if (report.getTargetType() == TargetType.REVIEW) {
            reviewRepo.findById(report.getTargetId()).ifPresent(reviewRepo::delete);
        } else if (report.getTargetType() == TargetType.COMMENT) {
            commentRepo.findById(report.getTargetId()).ifPresent(c -> {
                c.setDeletedAt(LocalDateTime.now());
                commentRepo.save(c);
            });
        }
    }

    @Override
    @Transactional
    public void warnUser(Long id, ViolationActionRequest request) {
        Report report = resolve(id, ReportStatus.RESOLVED, request.resolution());
        User target = resolveTargetUser(report);
        if (target != null) {
            target.setStatus(UserStatus.WARNING);
            userRepo.save(target);
        }
    }

    @Override
    @Transactional
    public void banUser(Long id, ViolationActionRequest request) {
        Report report = resolve(id, ReportStatus.RESOLVED, request.resolution());
        User target = resolveTargetUser(report);
        if (target != null) {
            target.setStatus(UserStatus.BANNED);
            target.setEnabled(false);
            userRepo.save(target);
        }
    }

    @Override
    public long countPending() {
        return reportRepo.countByStatus(ReportStatus.PENDING);
    }

    private Report resolve(Long id, ReportStatus newStatus, String resolution) {
        Report report = reportRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Report not found: " + id));
        report.setStatus(newStatus);
        report.setResolution(resolution);
        reportRepo.save(report);
        log.info("[ADMIN ACTION] admin={} | status={} | reportId={} | time={}",
                adminEmail(), newStatus, id, LocalDateTime.now());
        return report;
    }

    private User resolveTargetUser(Report report) {
        if (report.getTargetType() == TargetType.REVIEW) {
            return reviewRepo.findById(report.getTargetId())
                    .map(Review::getUser).orElse(null);
        } else if (report.getTargetType() == TargetType.COMMENT) {
            return commentRepo.findById(report.getTargetId())
                    .map(Comment::getUser).orElse(null);
        }
        return null;
    }

    private String adminEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private ViolationDTO toDTO(Report r) {
        String reason = r.getType().name();
        if (r.getDescription() != null && !r.getDescription().isBlank()) {
            reason += ": " + r.getDescription();
        }
        String targetUserEmail = resolveTargetUserEmail(r);
        return new ViolationDTO(
                r.getId(),
                r.getTargetId(),
                r.getTargetType().name(),
                r.getReporter() != null ? r.getReporter().getEmail() : "—",
                targetUserEmail,
                reason,
                r.getStatus().name(),
                r.getResolution(),
                r.getCreatedAt()
        );
    }

    private String resolveTargetUserEmail(Report r) {
        try {
            if (r.getTargetType() == TargetType.REVIEW) {
                return reviewRepo.findById(r.getTargetId())
                        .map(rev -> rev.getUser().getEmail()).orElse("—");
            } else if (r.getTargetType() == TargetType.COMMENT) {
                return commentRepo.findById(r.getTargetId())
                        .map(c -> c.getUser().getEmail()).orElse("—");
            }
        } catch (Exception ignored) {}
        return "—";
    }
}
