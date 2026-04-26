package com.imdb.service;

import com.imdb.dto.response.DashboardStatsResponse;

public interface IAdminStatsService {
    DashboardStatsResponse getOverview();
}