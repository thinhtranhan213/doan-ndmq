package com.imdb.service;

public interface IEmailService {
    void sendNewPassword(String toEmail, String newPassword);

    void sendOtp(String toEmail, String otp);

    void sendWarningNotification(String toEmail, String username, String reason);

    void sendBannedNotification(String toEmail, String username, String reason);

    void sendUnbannedNotification(String toEmail, String username);
}
