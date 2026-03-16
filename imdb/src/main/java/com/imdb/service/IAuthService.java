package com.imdb.service;

import com.imdb.dto.request.RegisterCommonUserRequest;
import com.imdb.dto.response.LoginResponse;
import com.imdb.dto.response.OtpResponse;

public interface IAuthService {

    OtpResponse sendOtp(String email);

    void verifyOtp(String email, String otp);

    void resetPasswordWithOtp(String email, String otp, String newPassword);

    LoginResponse register(RegisterCommonUserRequest request);
}
