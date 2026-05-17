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

    public void sendBannedNotification(String toEmail, String username, String reason) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[IMDB] Tài khoản của bạn đã bị khóa");
        message.setText(
                "Xin chào " + username + ",\n\n" +
                "Tài khoản của bạn đã bị khóa bởi quản trị viên.\n" +
                "Lý do: " + (reason != null && !reason.isBlank() ? reason : "Không có lý do cụ thể") + "\n\n" +
                "Tài khoản bị khóa sẽ không thể đăng nhập hoặc sử dụng các tính năng của IMDB.\n" +
                "Nếu bạn cho rằng đây là nhầm lẫn, vui lòng liên hệ quản trị viên để được hỗ trợ.\n\n" +
                "Trân trọng,\nĐội ngũ IMDB"
        );
        mailSender.send(message);
    }

    public void sendUnbannedNotification(String toEmail, String username) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("[IMDB] Tài khoản của bạn đã được mở khóa");
        message.setText(
                "Xin chào " + username + ",\n\n" +
                "Tài khoản của bạn đã được quản trị viên mở khóa thành công.\n\n" +
                "Bạn có thể đăng nhập và sử dụng đầy đủ các tính năng của IMDB ngay bây giờ.\n\n" +
                "Trân trọng,\nĐội ngũ IMDB"
        );
        mailSender.send(message);
    }
}
