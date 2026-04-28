package com.imdb.controller;

import com.imdb.dto.request.ReviewRequest;
import com.imdb.dto.request.UpdateReviewRequest;
import com.imdb.dto.response.ReviewDto;
import com.imdb.entity.ReactionType;
import com.imdb.service.IReviewCrudService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final IReviewCrudService reviewService;

    @PostMapping
    public ResponseEntity<ReviewDto> create(@Valid @RequestBody ReviewRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(reviewService.create(req));
    }

    @GetMapping("/film/{filmId}")
    public ResponseEntity<Page<ReviewDto>> getByFilm(
            @PathVariable Long filmId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String sort) {
        return ResponseEntity.ok(reviewService.getByFilm(filmId, page, size, sort));
    }

    @GetMapping("/film/{filmId}/my")
    public ResponseEntity<ReviewDto> getMyReview(@PathVariable Long filmId) {
        return ResponseEntity.ok(reviewService.getMyReview(filmId));
    }

    @GetMapping("/film/{filmId}/score-distribution")
    public ResponseEntity<Map<Integer, Long>> getScoreDistribution(@PathVariable Long filmId) {
        return ResponseEntity.ok(reviewService.getScoreDistribution(filmId));
    }

    @GetMapping("/me")
    public ResponseEntity<Page<ReviewDto>> getMyReviews(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(reviewService.getMyReviews(page, size));
    }

    @GetMapping("/{reviewId}")
    public ResponseEntity<ReviewDto> getById(@PathVariable Long reviewId) {
        return ResponseEntity.ok(reviewService.getById(reviewId));
    }

    @PutMapping("/{reviewId}")
    public ResponseEntity<ReviewDto> update(
            @PathVariable Long reviewId,
            @Valid @RequestBody UpdateReviewRequest req) {
        return ResponseEntity.ok(reviewService.update(reviewId, req));
    }

    @DeleteMapping("/{reviewId}")
    public ResponseEntity<Void> delete(@PathVariable Long reviewId) {
        reviewService.delete(reviewId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{reviewId}/react")
    public ResponseEntity<ReviewDto> react(
            @PathVariable Long reviewId,
            @RequestParam String type) {
        ReactionType reactionType;
        try {
            reactionType = ReactionType.valueOf(type.toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
        return ResponseEntity.ok(reviewService.toggleReaction(reviewId, reactionType));
    }

    @GetMapping("/{reviewId}/my-reaction")
    public ResponseEntity<Map<String, String>> getMyReaction(@PathVariable Long reviewId) {
        return ResponseEntity.ok(Map.of("reaction", reviewService.getMyReaction(reviewId)));
    }
}
