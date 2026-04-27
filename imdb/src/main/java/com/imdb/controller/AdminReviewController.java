package com.imdb.controller;

import com.imdb.dto.response.AdminReviewDTO;
import com.imdb.dto.response.MessageResponse;
import com.imdb.dto.response.PagedResponse;
import com.imdb.service.IAdminReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/reviews")
@RequiredArgsConstructor
public class AdminReviewController {

    private final IAdminReviewService reviewService;

    @GetMapping
    public ResponseEntity<PagedResponse<AdminReviewDTO>> getReviews(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(reviewService.getReviews(page, size));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<MessageResponse> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(new MessageResponse("Xoá đánh giá thành công"));
    }

    @PatchMapping("/{id}/hide")
    public ResponseEntity<MessageResponse> toggleHide(@PathVariable Long id) {
        reviewService.toggleHide(id);
        return ResponseEntity.ok(new MessageResponse("Cập nhật trạng thái ẩn thành công"));
    }
}