package com.imdb.service.impl;

import com.imdb.dto.request.FilmOverrideRequest;
import com.imdb.dto.response.FilmOverrideDTO;
import com.imdb.dto.response.PagedResponse;
import com.imdb.entity.FilmOverride;
import com.imdb.repository.FilmOverrideRepository;
import com.imdb.service.IAdminFilmService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminFilmService implements IAdminFilmService {

    private final FilmOverrideRepository filmOverrideRepository;

    @Override
    public PagedResponse<FilmOverrideDTO> getBlacklist(int page, int size) {
        Page<FilmOverride> p = filmOverrideRepository.findAll(
                PageRequest.of(page, size, Sort.by("createdAt").descending()));
        List<FilmOverrideDTO> data = p.getContent().stream().map(this::toDTO).toList();
        return new PagedResponse<>(data, p.getNumber(), p.getSize(), p.getTotalElements(), p.getTotalPages());
    }

    @Override
    @Transactional
    public FilmOverrideDTO addToBlacklist(FilmOverrideRequest request) {
        if (filmOverrideRepository.existsByTmdbId(request.tmdbId())) {
            throw new RuntimeException("TMDB ID " + request.tmdbId() + " đã có trong danh sách ẩn");
        }
        FilmOverride entity = new FilmOverride();
        entity.setTmdbId(request.tmdbId());
        entity.setTitle(request.title());
        entity.setPosterPath(request.posterPath());
        entity.setReason(request.reason());
        FilmOverride saved = filmOverrideRepository.save(entity);

        log.info("[ADMIN ACTION] admin={} | action=BLACKLIST_FILM | tmdbId={} | title={} | time={}",
                adminEmail(), request.tmdbId(), request.title(), LocalDateTime.now());
        return toDTO(saved);
    }

    @Override
    @Transactional
    public void removeFromBlacklist(Long id) {
        FilmOverride entity = filmOverrideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bản ghi: " + id));
        log.info("[ADMIN ACTION] admin={} | action=UNBLACKLIST_FILM | tmdbId={} | title={} | time={}",
                adminEmail(), entity.getTmdbId(), entity.getTitle(), LocalDateTime.now());
        filmOverrideRepository.delete(entity);
    }

    @Override
    public List<Long> getBlacklistedTmdbIds() {
        return filmOverrideRepository.findAll().stream()
                .map(FilmOverride::getTmdbId)
                .toList();
    }

    private String adminEmail() {
        return SecurityContextHolder.getContext().getAuthentication().getName();
    }

    private FilmOverrideDTO toDTO(FilmOverride f) {
        return new FilmOverrideDTO(f.getId(), f.getTmdbId(), f.getTitle(),
                f.getPosterPath(), f.getReason(), f.getCreatedAt());
    }
}