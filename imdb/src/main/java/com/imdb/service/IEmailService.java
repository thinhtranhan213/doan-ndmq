package com.imdb.service;

public interface IEmailService {
    void sendNewPassword(String toEmail, String newPassword);
}
