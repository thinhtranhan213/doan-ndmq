package com.imdb.service.impl;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.CreateReviewRequest;
import com.imdb.dto.response.*;
import com.imdb.entity.Review;
import com.imdb.entity.User;
import com.imdb.repository.ReviewRepository;
import com.imdb.service.IMovieService;
import com.imdb.service.IReviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@Service
@RequiredArgsConstructor
@Slf4j
public class ReviewService implements IReviewService {

    private final RestTemplate restTemplate;
    private final ReviewRepository reviewRepository;
    private final IMovieService movieService;

    @Value("${tmdb.api-key}")
    private String tmdbApiKey;

    @Value("${tmdb.base-url}")
    private String tmdbBaseUrl;

    private HttpEntity<?> createAuthHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + tmdbApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        return new HttpEntity<>(headers);
    }

    @Override
    public ReviewResponse getMovieReviews(Long movieId, Integer page) {

        Integer safePage = page != null && page > 0 ? page : 1;

        List<ReviewItem> tmdbResults = new ArrayList<>();

        // ==============================
        // 1. CALL TMDB (SAFE)
        // ==============================
        try {
            URI uri = UriComponentsBuilder
                    .fromUriString(tmdbBaseUrl + "/movie/" + movieId + "/reviews")
                    .queryParam("language", "en-US")
                    .queryParam("page", safePage)
                    .build()
                    .toUri();

            log.info("Fetching movie reviews from TMDB: {}", uri);

            ResponseEntity<ReviewResponse> response = restTemplate.exchange(
                    uri,
                    HttpMethod.GET,
                    createAuthHeaders(),
                    ReviewResponse.class
            );

            ReviewResponse body = response.getBody();

            if (body != null && body.getResults() != null) {
                tmdbResults = body.getResults();
            }

        } catch (Exception ex) {
            log.warn("TMDB API failed, fallback to DB only. movieId={}", movieId, ex);
        }

        // ==============================
        // 2. DB REVIEWS (SAFE + NO N+1)
        // ==============================
        List<Review> dbReviews = Optional.ofNullable(
                reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId)
        ).orElse(Collections.emptyList());

        List<ReviewItem> userReviews = dbReviews.stream()
                .map(this::mapToTmdbFormatSafe)
                .toList();

        // ==============================
        // 3. MERGE (LIMIT SIZE)
        // ==============================
        int LIMIT = 20;

        List<ReviewItem> merged = Stream.concat(
                userReviews.stream(),
                tmdbResults.stream()
        ).limit(LIMIT).toList();

        // ==============================
        // 4. BUILD RESPONSE (SAFE)
        // ==============================
        ReviewResponse result = new ReviewResponse();
        result.setId(movieId != null ? movieId : 0L);
        result.setPage(safePage);
        result.setResults(merged);

        return result;
    }

    @Override
    public ReviewItem createReview(Long movieId, CreateReviewRequest request) {
        // 🔐 lấy user từ JWT
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        User user = userDetails.getUser();

        Review review = Review.builder()
                .movieId(movieId)
                .content(
                        request.getComment() != null && !request.getComment().isBlank()
                                ? request.getComment()
                                : "No comment"
                )
                .rating(
                        request.getRating() != null ? request.getRating() : 0
                )
                .createdAt(LocalDateTime.now())
                .user(user)
                .build();

        Review saved = reviewRepository.save(review);

        return mapToTmdbFormatSafe(saved);
    }

    @Override
    public List<ReviewResponse> getMyRecentReviews(User user, int limit) {
//        Pageable pageable = PageRequest.of(0, limit, Sort.by("createdAt").descending());
//
//        List<Review> reviews = reviewRepository.findByUser(user, pageable);
//
//        if (reviews.isEmpty()) return List.of();
//
//        List<Long> movieIds = reviews.stream()
//                .map(Review::getMovieId)
//                .distinct()
//                .toList();
//
//        Map<Long, MovieResult> movieMap = movieIds.stream()
//                .collect(Collectors.toMap(
//                        id -> id,
//                        movieService::getMovieDetail
//                ));
//
//        return reviews.stream().map(review -> {
//            MovieResult movie = movieMap.get(review.getMovieId());
//
//            return ReviewResponse.builder()
//                    .id(review.getId())
//                    .movieId(review.getMovieId())
//                    .movieTitle(movie != null ? movie.getTitle() : "Unknown")
//                    .posterPath(movie != null ? movie.getPoster_path() : null)
//                    .rating(review.getRating())
//                    .content(review.getContent())
//                    .preview(buildPreview(review.getContent()))
//                    .createdAt(review.getCreatedAt())
//                    .build();
//        }).toList();
        return new ArrayList<>();
    }


    // ======================================================
    // 🔄 SAFE MAPPING DB → TMDB FORMAT
    // ======================================================
    private ReviewItem mapToTmdbFormatSafe(Review review) {

        if (review == null) {
            return buildDefaultReview();
        }

        String username = Optional.ofNullable(review.getUser())
                .map(User::getFullName)
                .filter(name -> !name.isBlank())
                .orElse("Anonymous");

        String content = Optional.ofNullable(review.getContent())
                .filter(c -> !c.isBlank())
                .orElse("No content");

        Double rating = Optional.ofNullable(review.getRating())
                .map(Integer::doubleValue)
                .map(r -> Math.min(10.0, Math.max(1.0, r)))
                .orElse(null);

        String createdAt = Optional.ofNullable(review.getCreatedAt())
                .map(this::toIso)
                .orElse(toIso(LocalDateTime.now()));

        return ReviewItem.builder()
                .id("local-" + Optional.ofNullable(review.getId()).orElse(0L))
                .author(username)
                .content(content)
                .created_at(createdAt)
                .updated_at(createdAt)
                .url("")
                .author_details(
                        AuthorDetails.builder()
                                .name(username)
                                .username(username)
                                .avatar_path(null)
                                .rating(rating)
                                .build()
                )
                .build();
    }

    // ======================================================
    // ⏱ TIME FORMAT ISO (TMDB STYLE)
    // ======================================================
    private String toIso(LocalDateTime time) {
        return time.atZone(ZoneId.systemDefault())
                .withZoneSameInstant(ZoneOffset.UTC)
                .toInstant()
                .toString();
    }

    // ======================================================
    // 🛟 DEFAULT REVIEW (fallback cực đoan)
    // ======================================================
    private ReviewItem buildDefaultReview() {
        String now = toIso(LocalDateTime.now());

        return ReviewItem.builder()
                .id("local-0")
                .author("Anonymous")
                .content("No content")
                .created_at(now)
                .updated_at(now)
                .url("")
                .author_details(
                        AuthorDetails.builder()
                                .name("Anonymous")
                                .username("anonymous")
                                .avatar_path(null)
                                .rating(null)
                                .build()
                )
                .build();
    }
}