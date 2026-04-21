package com.imdb.service;

import com.imdb.config.user.CustomUserDetails;
import com.imdb.dto.request.ChangePasswordRequest;
import com.imdb.dto.request.UpdateProfileRequest;
import com.imdb.dto.response.ProfileResponse;

public interface IUserService {
    void changePassword(ChangePasswordRequest request);

    void updateProfile(String email, UpdateProfileRequest request);

    public ProfileResponse getProfile(CustomUserDetails userDetails);
}
