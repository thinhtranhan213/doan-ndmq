package com.imdb.service.impl;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.CreateCommentRequest;
import com.imdb.dto.request.UpdateCommentRequest;
import com.imdb.dto.response.CommentDto;
import com.imdb.dto.response.UserSummary;
import com.imdb.entity.Comment;
import com.imdb.entity.Review;
import com.imdb.entity.User;
import com.imdb.repository.CommentRepository;
import com.imdb.repository.ReviewRepository;
import com.imdb.service.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {

    private final CommentRepository commentRepo;
    private final ReviewRepository reviewRepo;

    private User currentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return ((CustomUserDetails) auth.getPrincipal()).getUser();
    }

    private User currentUserOrNull() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) return null;
        return ((CustomUserDetails) auth.getPrincipal()).getUser();
    }

    private CommentDto toDto(Comment c, User viewer) {
        List<CommentDto> replies = List.of();
        if (c.getParentComment() == null) {
            replies = commentRepo.findByParentCommentIdAndDeletedAtIsNull(c.getId())
                    .stream()
                    .map(reply -> toDto(reply, viewer))
                    .toList();
        }
        boolean isOwner = viewer != null && c.getUser().getId().equals(viewer.getId());
        String content = c.getDeletedAt() != null ? "[Đã xóa]" : c.getContent();
        return new CommentDto(
                c.getId(),
                c.getReview().getId(),
                new UserSummary(c.getUser().getId(), c.getUser().getFullName(), null),
                content,
                c.getCreatedAt(),
                Boolean.TRUE.equals(c.getIsEdited()),
                c.getParentComment() != null ? c.getParentComment().getId() : null,
                replies,
                isOwner
        );
    }

    @Override
    @Transactional
    public CommentDto create(CreateCommentRequest req) {
        User user = currentUser();
        Review review = reviewRepo.findById(req.reviewId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Review không tồn tại"));

        Comment.CommentBuilder builder = Comment.builder()
                .review(review)
                .user(user)
                .content(req.content());

        if (req.parentCommentId() != null) {
            Comment parent = commentRepo.findById(req.parentCommentId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment gốc không tồn tại"));
            // Only allow 1 level deep
            if (parent.getParentComment() != null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ hỗ trợ reply 1 cấp");
            }
            builder.parentComment(parent);
        }

        return toDto(commentRepo.save(builder.build()), user);
    }

    @Override
    public Page<CommentDto> getByReview(Long reviewId, int page, int size) {
        User viewer = currentUserOrNull();
        return commentRepo.findByReviewIdAndParentCommentIsNullAndDeletedAtIsNull(
                reviewId,
                PageRequest.of(page, size, Sort.by("createdAt").ascending())
        ).map(c -> toDto(c, viewer));
    }

    @Override
    @Transactional
    public CommentDto update(Long commentId, UpdateCommentRequest req) {
        User user = currentUser();
        Comment c = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!c.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        c.setContent(req.content());
        c.setIsEdited(true);
        return toDto(commentRepo.save(c), user);
    }

    @Override
    @Transactional
    public void delete(Long commentId) {
        User user = currentUser();
        Comment c = commentRepo.findById(commentId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
        if (!c.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        c.setDeletedAt(LocalDateTime.now());
        commentRepo.save(c);
    }
}
