package com.imdb.service;

import com.imdb.dto.response.AdminReviewDTO;
import com.imdb.dto.response.PagedResponse;

public interface IAdminReviewService {
    PagedResponse<AdminReviewDTO> getReviews(int page, int size);
    void deleteReview(Long id);
    void toggleHide(Long id);
}