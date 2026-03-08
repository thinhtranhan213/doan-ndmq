package com.imdb.service;

import com.imdb.dto.request.ChangePasswordRequest;

public interface IUserService {
    void changePassword(ChangePasswordRequest request);
}
