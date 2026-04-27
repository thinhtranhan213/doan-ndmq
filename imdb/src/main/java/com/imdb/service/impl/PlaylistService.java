package com.imdb.service.impl;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.response.PlaylistResponse;
import com.imdb.dto.response.PlaylistMovieDTO;
import com.imdb.entity.Playlist;
import com.imdb.entity.PlaylistMovie;
import com.imdb.entity.User;
import com.imdb.repository.PlaylistMovieRepository;
import com.imdb.repository.PlaylistRepository;
import com.imdb.service.IPlaylistService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class PlaylistService implements IPlaylistService {

    private final PlaylistRepository playlistRepo;
    private final PlaylistMovieRepository playlistMovieRepo;

    @Override
    public Playlist createPlaylist(Long userId, String name) {
        Playlist playlist = new Playlist();
        playlist.setName(name);
        playlist.setUserId(userId);
        log.info("Creating movie playlist");
        return playlistRepo.save(playlist);
    }

    @Override
    public boolean toggleMovie(Long playlistId, Long movieId) {
        Optional<PlaylistMovie> existing = playlistMovieRepo.findByPlaylistIdAndMovieId(playlistId, movieId);

        if (existing.isPresent()) {
            playlistMovieRepo.delete(existing.get());
            log.info("Removing movie from playlist");
            return false; // removed
        }

        Playlist playlist = playlistRepo.findById(playlistId).orElseThrow();

        PlaylistMovie pm = new PlaylistMovie();
        pm.setMovieId(movieId);
        pm.setPlaylist(playlist);
        log.info("Adding movie to playlist");
        playlistMovieRepo.save(pm);
        return true; // added
    }

    @Override
    public List<PlaylistResponse> getUserPlaylists(Long userId, Long movieId) {
        List<Playlist> playlists = playlistRepo.findByUserId(userId);

        return playlists.stream().map(p -> {
            boolean contains = playlistMovieRepo
                    .findByPlaylistIdAndMovieId(p.getId(), movieId)
                    .isPresent();

            return new PlaylistResponse(p.getId(), p.getName(), contains);
        }).toList();
    }

    @Override
    public List<PlaylistMovieDTO> getPlaylistMovies(Long playlistId) {
        log.info("Fetching movies for playlist: {}", playlistId);
        return playlistMovieRepo.findByPlaylistId(playlistId)
                .stream()
                .map(pm -> new PlaylistMovieDTO(pm.getMovieId()))
                .toList();
    }
}
