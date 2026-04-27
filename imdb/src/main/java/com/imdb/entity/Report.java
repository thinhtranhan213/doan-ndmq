package com.imdb.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reports", uniqueConstraints = {
        @UniqueConstraint(name = "uc_report_user_target", columnNames = {"reporter_id", "target_id", "target_type"})
})
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reporter_id", nullable = false)
    private User reporter;

    @Column(nullable = false)
    private Long targetId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TargetType targetType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportType type;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String resolution;
}