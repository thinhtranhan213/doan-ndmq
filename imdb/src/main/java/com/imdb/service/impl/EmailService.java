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

    public void sendWarningNotification(String toEmail, String username, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[IMDB] Tài khoản của bạn đã bị cảnh báo");
        message.setText(
                "Xin chào " + username + ",\n\n" +
                "Tài khoản của bạn đã bị gắn cảnh báo (WARNING) bởi quản trị viên.\n" +
                "Lý do: " + (reason != null && !reason.isBlank() ? reason : "Không có lý do cụ thể") + "\n\n" +
                "Nếu bạn tiếp tục vi phạm quy định, tài khoản của bạn có thể bị khóa vĩnh viễn.\n\n" +
                "Trân trọng,\nĐội ngũ IMDB"
        );
        mailSender.send(message);
    }
}
