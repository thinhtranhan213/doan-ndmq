package com.imdb.service;

import com.imdb.dto.request.CreateReviewRequest;
import com.imdb.dto.response.ReviewItem;
import com.imdb.dto.response.ReviewResponse;

public interface IReviewService {
    ReviewResponse getMovieReviews(Long movieId, Integer page);
    ReviewItem createReview(Long movieId, CreateReviewRequest request);
}
