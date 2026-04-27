package com.imdb.repository;

import com.imdb.dto.projection.DayStatProjection;
import com.imdb.entity.Report;
import com.imdb.entity.ReportStatus;
import com.imdb.entity.TargetType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {

    boolean existsByReporterIdAndTargetIdAndTargetType(Long reporterId, Long targetId, TargetType targetType);

    Page<Report> findByStatus(ReportStatus status, Pageable pageable);

    long countByStatus(ReportStatus status);

    @Query(value = "SELECT DATE(created_at) AS day, COUNT(*) AS count FROM reports WHERE created_at >= :since GROUP BY day ORDER BY day", nativeQuery = true)
    List<DayStatProjection> countGroupedByDay(@Param("since") LocalDateTime since);
}
