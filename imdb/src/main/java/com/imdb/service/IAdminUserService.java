package com.imdb.service;

import com.imdb.dto.request.UserRoleRequest;
import com.imdb.dto.request.UserStatusRequest;
import com.imdb.dto.response.PagedResponse;
import com.imdb.dto.response.UserAdminDTO;

public interface IAdminUserService {
    PagedResponse<UserAdminDTO> getUsers(int page, int size, String status, String role, String search);
    UserAdminDTO getUserById(Long id);
    void updateUserStatus(Long id, UserStatusRequest request);
    void updateUserRole(Long id, UserRoleRequest request);
}