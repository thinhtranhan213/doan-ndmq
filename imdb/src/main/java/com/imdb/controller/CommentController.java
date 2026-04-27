package com.imdb.controller;

import com.imdb.dto.request.CreateCommentRequest;
import com.imdb.dto.request.UpdateCommentRequest;
import com.imdb.dto.response.CommentDto;
import com.imdb.service.ICommentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comments")
@RequiredArgsConstructor
public class CommentController {

    private final ICommentService commentService;

    @PostMapping
    public ResponseEntity<CommentDto> create(@Valid @RequestBody CreateCommentRequest req) {
        return ResponseEntity.status(HttpStatus.CREATED).body(commentService.create(req));
    }

    @GetMapping("/review/{reviewId}")
    public ResponseEntity<Page<CommentDto>> getByReview(
            @PathVariable Long reviewId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        return ResponseEntity.ok(commentService.getByReview(reviewId, page, size));
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentDto> update(
            @PathVariable Long commentId,
            @Valid @RequestBody UpdateCommentRequest req) {
        return ResponseEntity.ok(commentService.update(commentId, req));
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> delete(@PathVariable Long commentId) {
        commentService.delete(commentId);
        return ResponseEntity.noContent().build();
    }
}
