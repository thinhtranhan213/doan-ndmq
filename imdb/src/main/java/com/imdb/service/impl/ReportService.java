package com.imdb.service.impl;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.CreateReportRequest;
import com.imdb.entity.*;
import com.imdb.repository.ReportRepository;
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

        reportRepo.save(Report.builder()
                .reporter(user)
                .targetId(req.targetId())
                .targetType(targetType)
                .type(reportType)
                .description(req.description())
                .build());
    }
}
