package com.imdb.repository;

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

    @Query("SELECT DATE(r.createdAt) as day, COUNT(r) FROM Review r WHERE r.createdAt >= :since GROUP BY DATE(r.createdAt) ORDER BY day")
    List<Object[]> countGroupedByDay(@Param("since") LocalDateTime since);

    @Query("""
            SELECT r.movieId, COUNT(r) as cnt FROM Review r
            GROUP BY r.movieId ORDER BY cnt DESC
            """)
    List<Object[]> findTopMovieIdsByReviewCount(Pageable pageable);
}