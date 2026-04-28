package com.imdb.repository;

import com.imdb.dto.projection.DayStatProjection;
import com.imdb.dto.response.MovieReviewCount;
import com.imdb.dto.response.RatingCount;
import com.imdb.entity.Review;
import com.imdb.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByMovieIdOrderByCreatedAtDesc(Long movieId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.movieId = :movieId")
    Double getAverageRating(Long movieId);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.user.id = :userId")
    int countByUserId(Long userId);

    List<Review> findByUser(User user, Pageable pageable);

    long countByHidden(boolean hidden);

    Page<Review> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.createdAt >= :since")
    long countCreatedSince(@Param("since") LocalDateTime since);

    @Query(value = "SELECT DATE(created_at) AS day, COUNT(*) AS count FROM reviews WHERE created_at >= :since GROUP BY day ORDER BY day", nativeQuery = true)
    List<DayStatProjection> countGroupedByDay(@Param("since") LocalDateTime since);

    @Query("SELECT new com.imdb.dto.response.MovieReviewCount(r.movieId, COUNT(r)) FROM Review r GROUP BY r.movieId ORDER BY COUNT(r) DESC")
    List<MovieReviewCount> findTopMovieIdsByReviewCount(Pageable pageable);

    Optional<Review> findByMovieIdAndUserId(Long movieId, Long userId);

    boolean existsByMovieIdAndUserId(Long movieId, Long userId);

    Page<Review> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Review> findByMovieIdAndHiddenFalse(Long movieId, Pageable pageable);

    @Query("SELECT new com.imdb.dto.response.RatingCount(r.rating, COUNT(r)) FROM Review r WHERE r.movieId = :filmId AND r.hidden = false GROUP BY r.rating")
    List<RatingCount> countByRatingForFilm(@Param("filmId") Long filmId);
}