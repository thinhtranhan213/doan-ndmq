package com.imdb.service.impl;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.CreateReportRequest;
import com.imdb.entity.*;
import com.imdb.repository.CommentRepository;
import com.imdb.repository.ReportRepository;
import com.imdb.repository.ReviewRepository;
import com.imdb.service.IReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ReportService implements IReportService {

    private final ReportRepository reportRepo;
    private final ReviewRepository reviewRepo;
    private final CommentRepository commentRepo;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return ((CustomUserDetails) auth.getPrincipal()).getUser();
    }

    @Override
    @Transactional
    public void create(CreateReportRequest req) {
        User user = currentUser();
        TargetType targetType;
        ReportType reportType;
        try {
            targetType = TargetType.valueOf(req.targetType());
            reportType = ReportType.valueOf(req.type());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại không hợp lệ");
        }

        if (reportRepo.existsByReporterIdAndTargetIdAndTargetType(user.getId(), req.targetId(), targetType)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã báo cáo nội dung này rồi");
        }

        User targetUser = null;
        String targetContent = null;
        Long targetMovieId = null;

        if (targetType == TargetType.REVIEW) {
            Review review = reviewRepo.findById(req.targetId()).orElse(null);
            if (review != null) {
                targetUser = review.getUser();
                targetContent = review.getContent();
                targetMovieId = review.getMovieId();
            }
        } else if (targetType == TargetType.COMMENT) {
            Comment comment = commentRepo.findById(req.targetId()).orElse(null);
            if (comment != null) {
                targetUser = comment.getUser();
                targetContent = comment.getContent();
                targetMovieId = comment.getReview().getMovieId();
            }
        }

        reportRepo.save(Report.builder()
                .reporter(user)
                .targetId(req.targetId())
                .targetType(targetType)
                .type(reportType)
                .description(req.description())
                .targetUser(targetUser)
                .targetContent(targetContent)
                .targetMovieId(targetMovieId)
                .build());
    }
}
