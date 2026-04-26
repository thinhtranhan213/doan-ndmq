package com.imdb.repository;

import com.imdb.entity.Movie;
import com.imdb.entity.MovieStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {

    @Query("""
            SELECT m FROM Movie m WHERE
              (:status IS NULL OR m.status = :status) AND
              (:search IS NULL OR LOWER(m.title) LIKE LOWER(CONCAT('%', :search, '%')))
            """)
    Page<Movie> findMoviesWithFilters(
            @Param("status") MovieStatus status,
            @Param("search") String search,
            Pageable pageable);

    long countByStatus(MovieStatus status);
}