package com.imdb.service.impl;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.ReviewRequest;
import com.imdb.dto.request.UpdateReviewRequest;
import com.imdb.dto.response.ReviewDto;
import com.imdb.dto.response.UserSummary;
import com.imdb.entity.ReactionType;
import com.imdb.entity.Review;
import com.imdb.entity.ReviewLike;
import com.imdb.entity.User;
import com.imdb.repository.CommentRepository;
import com.imdb.repository.ReviewLikeRepository;
import com.imdb.repository.ReviewRepository;
import com.imdb.service.IReviewCrudService;
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

import com.imdb.dto.response.RatingCount;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewCrudService implements IReviewCrudService {

    private final ReviewRepository reviewRepo;
    private final ReviewLikeRepository likeRepo;
    private final CommentRepository commentRepo;

    // ── Auth helpers ────────────────────────────────────────────────────────────

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

    // ── Mapping ─────────────────────────────────────────────────────────────────

    private ReviewDto toDto(Review r, User viewer) {
        String reaction = "NONE";
        boolean isOwner = false;
        if (viewer != null) {
            reaction = likeRepo.findByReviewIdAndUserId(r.getId(), viewer.getId())
                    .map(l -> l.getType().name())
                    .orElse("NONE");
            isOwner = r.getUser().getId().equals(viewer.getId());
        }
        long commentCount = commentRepo.countByReviewIdAndDeletedAtIsNull(r.getId());
        UserSummary userSummary = new UserSummary(
                r.getUser().getId(),
                r.getUser().getFullName(),
                null
        );
        return new ReviewDto(
                r.getId(), r.getMovieId(), userSummary,
                r.getRating(), r.getContent(),
                r.getCreatedAt(), r.getEditedAt(), Boolean.TRUE.equals(r.getIsEdited()),
                r.getLikeCount() == null ? 0 : r.getLikeCount(),
                r.getDislikeCount() == null ? 0 : r.getDislikeCount(),
                reaction, commentCount, isOwner
        );
    }

    // ── CRUD ────────────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public ReviewDto create(ReviewRequest req) {
        User user = currentUser();
        if (reviewRepo.existsByMovieIdAndUserId(req.filmId(), user.getId())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Bạn đã đánh giá phim này rồi");
        }
        Review review = Review.builder()
                .movieId(req.filmId())
                .rating(req.score())
                .content(req.content())
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();
        return toDto(reviewRepo.save(review), user);
    }

    @Override
    public Page<ReviewDto> getByFilm(Long filmId, int page, int size, String sort) {
        User viewer = currentUserOrNull();
        Sort jpaSort = switch (sort == null ? "newest" : sort) {
            case "highest"   -> Sort.by("rating").descending();
            case "lowest"    -> Sort.by("rating").ascending();
            case "mostLiked" -> Sort.by("likeCount").descending();
            default          -> Sort.by("createdAt").descending();
        };
        return reviewRepo.findByMovieIdAndHiddenFalse(filmId, PageRequest.of(page, size, jpaSort))
                .map(r -> toDto(r, viewer));
    }

    @Override
    public ReviewDto getMyReview(Long filmId) {
        User user = currentUser();
        Review r = reviewRepo.findByMovieIdAndUserId(filmId, user.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(r, user);
    }

    @Override
    public Page<ReviewDto> getMyReviews(int page, int size) {
        User user = currentUser();
        return reviewRepo.findByUserIdOrderByCreatedAtDesc(
                user.getId(), PageRequest.of(page, size)
        ).map(r -> toDto(r, user));
    }

    @Override
    public ReviewDto getById(Long reviewId) {
        Review r = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return toDto(r, currentUserOrNull());
    }

    @Override
    @Transactional
    public ReviewDto update(Long reviewId, UpdateReviewRequest req) {
        User user = currentUser();
        Review r = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!r.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        r.setRating(req.score());
        r.setContent(req.content());
        r.setIsEdited(true);
        r.setEditedAt(LocalDateTime.now());
        return toDto(reviewRepo.save(r), user);
    }

    @Override
    @Transactional
    public void delete(Long reviewId) {
        User user = currentUser();
        Review r = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        boolean isAdmin = user.getRoles().stream().anyMatch(role -> role.getName().equals("ROLE_ADMIN"));
        if (!r.getUser().getId().equals(user.getId()) && !isAdmin) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        reviewRepo.delete(r);
    }

    @Override
    @Transactional
    public ReviewDto toggleReaction(Long reviewId, ReactionType type) {
        User user = currentUser();
        Review review = reviewRepo.findById(reviewId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        Optional<ReviewLike> existing = likeRepo.findByReviewIdAndUserId(reviewId, user.getId());

        if (existing.isPresent()) {
            ReviewLike like = existing.get();
            if (like.getType() == type) {
                // Toggle off: same type clicked again
                likeRepo.delete(like);
                if (type == ReactionType.LIKE)    review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
                else                              review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
            } else {
                // Switch: LIKE ↔ DISLIKE
                like.setType(type);
                likeRepo.save(like);
                if (type == ReactionType.LIKE) {
                    review.setLikeCount(review.getLikeCount() + 1);
                    review.setDislikeCount(Math.max(0, review.getDislikeCount() - 1));
                } else {
                    review.setDislikeCount(review.getDislikeCount() + 1);
                    review.setLikeCount(Math.max(0, review.getLikeCount() - 1));
                }
            }
        } else {
            // New reaction
            likeRepo.save(ReviewLike.builder().review(review).user(user).type(type).build());
            if (type == ReactionType.LIKE) review.setLikeCount(review.getLikeCount() + 1);
            else                           review.setDislikeCount(review.getDislikeCount() + 1);
        }

        return toDto(reviewRepo.save(review), user);
    }

    @Override
    public String getMyReaction(Long reviewId) {
        User user = currentUser();
        return likeRepo.findByReviewIdAndUserId(reviewId, user.getId())
                .map(l -> l.getType().name())
                .orElse("NONE");
    }

    @Override
    public Map<Integer, Long> getScoreDistribution(Long filmId) {
        return reviewRepo.countByRatingForFilm(filmId).stream()
                .collect(Collectors.toMap(RatingCount::rating, RatingCount::count));
    }
}
