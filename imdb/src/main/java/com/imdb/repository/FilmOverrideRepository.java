package com.imdb.repository;

import com.imdb.entity.FilmOverride;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FilmOverrideRepository extends JpaRepository<FilmOverride, Long> {
    boolean existsByTmdbId(Long tmdbId);
    Optional<FilmOverride> findByTmdbId(Long tmdbId);
    List<FilmOverride> findAllByTmdbIdIn(List<Long> tmdbIds);
}