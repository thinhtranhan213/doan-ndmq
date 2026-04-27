package com.imdb.controller;

import com.imdb.dto.response.DashboardStatsResponse;
import com.imdb.service.IAdminStatsService;
import com.imdb.service.IAdminViolationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {

    private final IAdminStatsService statsService;
    private final IAdminViolationService violationService;

    @GetMapping("/overview")
    public ResponseEntity<DashboardStatsResponse> getOverview() {
        return ResponseEntity.ok(statsService.getOverview());
    }

    @GetMapping("/pending-violations")
    public ResponseEntity<Map<String, Long>> getPendingViolations() {
        return ResponseEntity.ok(Map.of("count", violationService.countPending()));
    }
}