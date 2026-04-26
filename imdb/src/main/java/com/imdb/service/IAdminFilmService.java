package com.imdb.service;

import com.imdb.dto.request.FilmOverrideRequest;
import com.imdb.dto.response.FilmOverrideDTO;
import com.imdb.dto.response.PagedResponse;

import java.util.List;

public interface IAdminFilmService {
    PagedResponse<FilmOverrideDTO> getBlacklist(int page, int size);
    FilmOverrideDTO addToBlacklist(FilmOverrideRequest request);
    void removeFromBlacklist(Long id);
    List<Long> getBlacklistedTmdbIds();
}