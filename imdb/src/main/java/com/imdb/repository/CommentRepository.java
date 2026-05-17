package com.imdb.repository;

import com.imdb.entity.Comment;
import com.imdb.entity.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    @Query("SELECT c FROM Comment c WHERE c.review.id = :reviewId AND c.parentComment IS NULL AND c.deletedAt IS NULL AND c.user.status <> com.imdb.entity.UserStatus.BANNED")
    Page<Comment> findByReviewIdAndParentCommentIsNullAndDeletedAtIsNull(@Param("reviewId") Long reviewId, Pageable pageable);

    @Query("SELECT c FROM Comment c WHERE c.parentComment.id = :parentCommentId AND c.deletedAt IS NULL AND c.user.status <> com.imdb.entity.UserStatus.BANNED")
    List<Comment> findByParentCommentIdAndDeletedAtIsNull(@Param("parentCommentId") Long parentCommentId);

    long countByReviewIdAndDeletedAtIsNull(Long reviewId);

    void deleteByReviewId(Long reviewId);
}
