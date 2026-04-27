package com.imdb.repository;

import com.imdb.entity.PlaylistMovie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlaylistMovieRepository extends JpaRepository<PlaylistMovie, Long> {
    Optional<PlaylistMovie> findByPlaylistIdAndMovieId(Long playlistId, Long movieId);

    @Query("""
                SELECT pm FROM PlaylistMovie pm
                WHERE pm.playlist.id = :playlistId AND pm.movieId = :movieId
            """)
    Optional<PlaylistMovie> findExisting(Long playlistId, Long movieId);

    List<PlaylistMovie> findByPlaylistId(Long playlistId);
}