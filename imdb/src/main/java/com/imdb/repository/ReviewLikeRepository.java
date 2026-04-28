package com.imdb.repository;

import com.imdb.entity.ReviewLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ReviewLikeRepository extends JpaRepository<ReviewLike, Long> {

    Optional<ReviewLike> findByReviewIdAndUserId(Long reviewId, Long userId);

    void deleteByReviewId(Long reviewId);
}
