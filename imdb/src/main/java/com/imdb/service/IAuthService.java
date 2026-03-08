package com.imdb.service;

import com.imdb.dto.request.RegisterCommonUserRequest;

public interface IAuthService {

    void forgotPassword(String email);

    void register(RegisterCommonUserRequest request);
}
