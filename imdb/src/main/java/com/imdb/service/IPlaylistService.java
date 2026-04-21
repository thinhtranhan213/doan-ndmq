package com.imdb.service;

import com.imdb.dto.response.PlaylistResponse;
import com.imdb.entity.Playlist;

import java.util.List;

public interface IPlaylistService {
    Playlist createPlaylist(Long userId, String name);
    boolean toggleMovie(Long playlistId, Long movieId);
    List<PlaylistResponse> getUserPlaylists(Long userId, Long movieId);
}
