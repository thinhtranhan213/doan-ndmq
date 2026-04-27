package com.imdb.controller;

import com.imdb.dto.request.CreateReportRequest;
import com.imdb.service.IReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final IReportService reportService;

    @PostMapping
    public ResponseEntity<Void> create(@Valid @RequestBody CreateReportRequest req) {
        reportService.create(req);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
