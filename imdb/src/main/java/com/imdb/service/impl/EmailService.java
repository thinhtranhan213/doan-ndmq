package com.imdb.service.impl;

import com.imdb.service.IEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService implements IEmailService {

    private final JavaMailSender mailSender;

    public void sendNewPassword(String toEmail, String newPassword) {

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your new password");
        message.setText("Your new password is: " + newPassword);

        mailSender.send(message);
    }

    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Your OTP for password reset");
        message.setText("Your OTP is: " + otp + "\n\nThis OTP will expire in 10 minutes.");

        mailSender.send(message);
    }
}
