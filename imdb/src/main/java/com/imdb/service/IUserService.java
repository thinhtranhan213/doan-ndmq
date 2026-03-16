package com.imdb.service;

import com.imdb.dto.request.ChangePasswordRequest;
import com.imdb.dto.request.UpdateProfileRequest;

public interface IUserService {
    void changePassword(ChangePasswordRequest request);

    void updateProfile(String email, UpdateProfileRequest request);
}
