package com.imdb.dto.response;

import java.util.List;

public record DashboardStatsResponse(
        long totalUsers,
        long activeUsers,
        long warningUsers,
        long bannedUsers,
        long totalReviews,
        long hiddenReviews,
        long totalFilms,
        long hiddenFilmsCount,
        long totalViolations,
        long pendingViolations,
        long ignoredViolations,
        long resolvedViolations,
        long newUsersThisWeek,
        List<DayStat> userChart,
        List<DayStat> reviewChart,
        List<DayStat> violationChart
) {
    public record DayStat(String date, long count) {}
}