package com.imdb.repository;

import com.imdb.entity.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long> {
    List<Playlist> findByUserId(Long userId);

    @Query("SELECT COUNT(p) FROM Playlist p WHERE p.userId = :userId")
    int countByUserId(Long userId);
}
