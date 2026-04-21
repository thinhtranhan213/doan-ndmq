package com.imdb.controller;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.response.PlaylistResponse;
import com.imdb.entity.Playlist;
import com.imdb.entity.User;
import com.imdb.service.impl.PlaylistService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/playlists")
@RequiredArgsConstructor
public class PlaylistController {

    private final PlaylistService playlistService;

//    @GetMapping
//    public List<Playlist> getMyPlaylists() {
//        Long userId = getUser().getId();
//        return playlistService.getUserPlaylists(userId);
//    }

    @PostMapping
    public Playlist create(@RequestBody Map<String, String> req) {
        Long userId = getUser().getId();
        return playlistService.createPlaylist(userId, req.get("name"));
    }

    @PostMapping("/{playlistId}/toggle")
    public boolean toggleMovie(
            @PathVariable Long playlistId,
            @RequestParam Long movieId
    ) {
        return playlistService.toggleMovie(playlistId, movieId);
    }

    protected User getUser(){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        CustomUserDetails userDetails = (CustomUserDetails) auth.getPrincipal();

        User user = userDetails.getUser();
        return user;
    }

    @GetMapping
    public List<PlaylistResponse> getMyPlaylists(
            @RequestParam(required = false) Long movieId
    ) {
        Long userId = getUser().getId();

        if (movieId != null) {
            return playlistService.getUserPlaylists(userId, movieId);
        }

        return playlistService.getUserPlaylists(userId, null);
    }
}
