package com.imdb.controller;

import com.imdb.dto.request.CreateReviewRequest;
import com.imdb.dto.response.ReviewItem;
import com.imdb.service.IMovieService;
import com.imdb.service.IReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@CrossOrigin(origins = "${app.frontend.url}")
public class MovieController {

    private final IMovieService movieService;
    private final IReviewService reviewService;

    @PostMapping("/{id}/reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewItem> createReview(
            @PathVariable Long id,
            @RequestBody CreateReviewRequest request
    ) {
        return ResponseEntity.ok(reviewService.createReview(id, request));
    }
}
