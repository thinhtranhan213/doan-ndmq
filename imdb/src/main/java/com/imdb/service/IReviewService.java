package com.imdb.service;

import com.imdb.dto.request.CreateReviewRequest;
import com.imdb.dto.response.ReviewItem;
import com.imdb.dto.response.ReviewResponse;
import com.imdb.entity.User;

import java.util.List;

public interface IReviewService {
    ReviewResponse getMovieReviews(Long movieId, Integer page);
    ReviewItem createReview(Long movieId, CreateReviewRequest request);
}
