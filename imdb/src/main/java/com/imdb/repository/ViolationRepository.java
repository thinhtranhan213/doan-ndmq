package com.imdb.repository;

import com.imdb.entity.Violation;
import com.imdb.entity.ViolationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ViolationRepository extends JpaRepository<Violation, Long> {
    Page<Violation> findByStatus(ViolationStatus status, Pageable pageable);
    long countByStatus(ViolationStatus status);

    @Query("SELECT DATE(v.createdAt) as day, COUNT(v) FROM Violation v WHERE v.createdAt >= :since GROUP BY DATE(v.createdAt) ORDER BY day")
    List<Object[]> countGroupedByDay(@Param("since") LocalDateTime since);
}