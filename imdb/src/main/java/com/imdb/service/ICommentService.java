package com.imdb.service;

import com.imdb.dto.request.CreateCommentRequest;
import com.imdb.dto.request.UpdateCommentRequest;
import com.imdb.dto.response.CommentDto;
import org.springframework.data.domain.Page;

public interface ICommentService {
    CommentDto create(CreateCommentRequest req);
    Page<CommentDto> getByReview(Long reviewId, int page, int size);
    CommentDto update(Long commentId, UpdateCommentRequest req);
    void delete(Long commentId);
}
