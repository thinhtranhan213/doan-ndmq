package com.imdb.service.impl;

import com.imdb.dto.response.DashboardStatsResponse;
import com.imdb.entity.UserStatus;
import com.imdb.entity.ViolationStatus;
import com.imdb.repository.FilmOverrideRepository;
import com.imdb.repository.ReviewRepository;
import com.imdb.repository.UserRepository;
import com.imdb.repository.ViolationRepository;
import com.imdb.service.IAdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStatsService implements IAdminStatsService {

    private final UserRepository userRepository;
    private final ReviewRepository reviewRepository;
    private final ViolationRepository violationRepository;
    private final FilmOverrideRepository filmOverrideRepository;

    @Override
    public DashboardStatsResponse getOverview() {
        long totalUsers        = userRepository.count();
        long activeUsers       = userRepository.countByStatus(UserStatus.ACTIVE);
        long warningUsers      = userRepository.countByStatus(UserStatus.WARNING);
        long bannedUsers       = userRepository.countByStatus(UserStatus.BANNED);
        long totalReviews      = reviewRepository.count();
        long hiddenReviews     = reviewRepository.countByHidden(true);
        long hiddenFilmsCount  = filmOverrideRepository.count();
        long totalViolations   = violationRepository.count();
        long pendingViolations = violationRepository.countByStatus(ViolationStatus.PENDING);
        long ignoredViolations = violationRepository.countByStatus(ViolationStatus.IGNORED);
        long resolvedViolations= violationRepository.countByStatus(ViolationStatus.RESOLVED);
        long newUsersThisWeek  = userRepository.countCreatedSince(LocalDateTime.now().minusDays(7));

        return new DashboardStatsResponse(
                totalUsers, activeUsers, warningUsers, bannedUsers,
                totalReviews, hiddenReviews,
                0L, hiddenFilmsCount,
                totalViolations, pendingViolations, ignoredViolations, resolvedViolations,
                newUsersThisWeek,
                buildChart(userRepository.countGroupedByDay(LocalDateTime.now().minusDays(6).toLocalDate().atStartOfDay())),
                buildChart(reviewRepository.countGroupedByDay(LocalDateTime.now().minusDays(6).toLocalDate().atStartOfDay())),
                buildChart(violationRepository.countGroupedByDay(LocalDateTime.now().minusDays(6).toLocalDate().atStartOfDay()))
        );
    }

    private List<DashboardStatsResponse.DayStat> buildChart(List<Object[]> rows) {
        Map<String, Long> countMap = rows.stream().collect(Collectors.toMap(
                r -> r[0].toString(),
                r -> ((Number) r[1]).longValue()));

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        List<DashboardStatsResponse.DayStat> result = new ArrayList<>();
        for (int i = 6; i >= 0; i--) {
            String day = LocalDate.now().minusDays(i).format(fmt);
            result.add(new DashboardStatsResponse.DayStat(day, countMap.getOrDefault(day, 0L)));
        }
        return result;
    }
}