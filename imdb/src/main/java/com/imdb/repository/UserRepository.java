package com.imdb.repository;

import com.imdb.entity.User;
import com.imdb.entity.UserStatus;
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
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    @Query("""
            SELECT u FROM User u WHERE
              (:status IS NULL OR u.status = :status) AND
              (:role   IS NULL OR EXISTS (SELECT r FROM u.roles r WHERE r.name = :role)) AND
              (:search IS NULL OR
                LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(CONCAT(u.firstName, ' ', u.lastName)) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<User> findUsersWithFilters(
            @Param("status") UserStatus status,
            @Param("role") String role,
            @Param("search") String search,
            Pageable pageable);

    long countByStatus(UserStatus status);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= :since")
    long countCreatedSince(@Param("since") LocalDateTime since);

    @Query("SELECT DATE(u.createdAt) as day, COUNT(u) FROM User u WHERE u.createdAt >= :since GROUP BY DATE(u.createdAt) ORDER BY day")
    List<Object[]> countGroupedByDay(@Param("since") LocalDateTime since);
}