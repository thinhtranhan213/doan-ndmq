package com.imdb.service.impl;

import com.imdb.dto.response.AdminReviewDTO;
import com.imdb.dto.response.PagedResponse;
import com.imdb.entity.Review;
import com.imdb.repository.CommentRepository;
import com.imdb.repository.ReviewLikeRepository;
import com.imdb.repository.ReviewRepository;
import com.imdb.service.IAdminReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminReviewService implements IAdminReviewService {

    private final ReviewRepository reviewRepository;
    private final ReviewLikeRepository reviewLikeRepository;
    private final CommentRepository commentRepository;

    @Override
    public PagedResponse<AdminReviewDTO> getReviews(int page, int size) {
        Page<Review> reviewPage = reviewRepository.findAllByOrderByCreatedAtDesc(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));

        List<AdminReviewDTO> data = reviewPage.getContent().stream()
                .map(this::toDTO).toList();

        return new PagedResponse<>(data, reviewPage.getNumber(), reviewPage.getSize(),
                reviewPage.getTotalElements(), reviewPage.getTotalPages());
    }

    @Override
    @Transactional
    public void deleteReview(Long id) {
        Review review = findOrThrow(id);
        log.info("[ADMIN ACTION] admin={} | action=DELETE_REVIEW | reviewId={} | time={}",
                adminEmail(), id, LocalDateTime.now());
        reviewLikeRepository.deleteByReviewId(id);
        commentRepository.deleteByReviewId(id);
        reviewRepository.delete(review);
    }

    @Override
    @Transactional
    public void toggleHide(Long id) {
        Review review = findOrThrow(id);
        boolean newHidden = !Boolean.TRUE.equals(review.getHidden());
        review.setHidden(newHidden);
        reviewRepository.save(review);
        log.info("[ADMIN ACTION] admin={} | action={} | reviewId={} | time={}",
                adminEmail(), newHidden ? "HIDE_REVIEW" : "UNHIDE_REVIEW", id, LocalDateTime.now());
    }

    private Review findOrThrow(Long id) {
        return reviewRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Review not found: " + id));
    }

    private String adminEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private AdminReviewDTO toDTO(Review r) {
        String name  = r.getUser() != null ? r.getUser().getFullName() : "—";
        String email = r.getUser() != null ? r.getUser().getEmail()    : "—";
        return new AdminReviewDTO(r.getId(), r.getMovieId(), name, email,
                r.getContent(), r.getRating(),
                Boolean.TRUE.equals(r.getHidden()), r.getCreatedAt());
    }
}