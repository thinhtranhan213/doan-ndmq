package com.imdb.service;

import com.imdb.dto.request.ViolationActionRequest;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.ViolationDTO;

public interface IAdminViolationService {
    PagedResponse<ViolationDTO> getViolations(int page, int size, String status);
    void ignore(Long id, ViolationActionRequest request);
    void removeContent(Long id, ViolationActionRequest request);
    void warnUser(Long id, ViolationActionRequest request);
    void banUser(Long id, ViolationActionRequest request);
    long countPending();
}