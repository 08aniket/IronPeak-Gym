package com.furkankaya.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private JavaMailSender mailSender;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    @Autowired
    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public String sendMutliMediaMail() {
        return null;
    }

    public void sendMail(String email, String messageContent) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("gym.app36@gmail.com");
            message.setTo(email);
            message.setSubject("IronPeak Gym");
            message.setText(messageContent);
            mailSender.send(message);
        } catch (Exception e) {
            // Log but never propagate — email is non-critical
            System.err.println("Mail send failed (non-critical): " + e.getMessage());
        }
    }

    public void sendPasswordChangeCode(String email, String code) {
        if (smtpUsername == null || smtpUsername.isBlank()) {
            throw new IllegalStateException("SMTP username is not configured.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(smtpUsername);
        message.setTo(email);
        message.setSubject("IronPeak Gym admin password verification");
        message.setText("Your verification code is " + code + ". It expires in 10 minutes. "
                + "If you did not request this change, you can ignore this email.");
        mailSender.send(message);
    }

}