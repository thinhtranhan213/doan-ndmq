package com.imdb.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review_likes", uniqueConstraints = {
        @UniqueConstraint(name = "uc_review_like_user", columnNames = {"user_id", "review_id"})
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReviewLike extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReactionType type;
}