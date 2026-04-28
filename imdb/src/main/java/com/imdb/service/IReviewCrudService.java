package com.imdb.service;

import com.imdb.dto.request.ReviewRequest;
import com.imdb.dto.request.UpdateReviewRequest;
import com.imdb.dto.response.ReviewDto;
import com.imdb.entity.ReactionType;
import org.springframework.data.domain.Page;

import java.util.Map;

public interface IReviewCrudService {
    ReviewDto create(ReviewRequest req);
    Page<ReviewDto> getByFilm(Long filmId, int page, int size, String sort);
    ReviewDto getMyReview(Long filmId);
    Page<ReviewDto> getMyReviews(int page, int size);
    ReviewDto getById(Long reviewId);
    ReviewDto update(Long reviewId, UpdateReviewRequest req);
    void delete(Long reviewId);
    ReviewDto toggleReaction(Long reviewId, ReactionType type);
    String getMyReaction(Long reviewId);
    Map<Integer, Long> getScoreDistribution(Long filmId);
}
