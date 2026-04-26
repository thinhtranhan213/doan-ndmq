package com.imdb.controller;

import com.imdb.dto.request.FilmOverrideRequest;
import com.imdb.dto.response.FilmOverrideDTO;
import com.imdb.dto.response.MessageResponse;
import com.imdb.dto.response.PagedResponse;
import com.imdb.service.IAdminFilmService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class AdminFilmController {

    private final IAdminFilmService filmService;

    // ── Admin endpoints (/api/admin/films) ──────────────────────────────────

    @GetMapping("/api/admin/films")
    public ResponseEntity<PagedResponse<FilmOverrideDTO>> getBlacklist(
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        return ResponseEntity.ok(filmService.getBlacklist(page, size));
    }

    @PostMapping("/api/admin/films")
    public ResponseEntity<FilmOverrideDTO> addToBlacklist(@RequestBody FilmOverrideRequest request) {
        return ResponseEntity.ok(filmService.addToBlacklist(request));
    }

    @DeleteMapping("/api/admin/films/{id}")
    public ResponseEntity<MessageResponse> removeFromBlacklist(@PathVariable Long id) {
        filmService.removeFromBlacklist(id);
        return ResponseEntity.ok(new MessageResponse("Đã xoá phim khỏi danh sách ẩn"));
    }

    // ── Public endpoint — frontend dùng để filter TMDB results ─────────────
    // Không cần auth, cho phép tất cả truy cập

    @GetMapping("/api/public/films/blacklist")
    public ResponseEntity<List<Long>> getBlacklistedIds() {
        return ResponseEntity.ok(filmService.getBlacklistedTmdbIds());
    }
}