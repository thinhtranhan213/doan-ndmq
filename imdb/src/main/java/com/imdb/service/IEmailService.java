package com.imdb.service;

public interface IEmailService {
    void sendNewPassword(String toEmail, String newPassword);

    void sendOtp(String toEmail, String otp);
}
