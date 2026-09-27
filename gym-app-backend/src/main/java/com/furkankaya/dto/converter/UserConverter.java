package com.furkankaya.dto.converter;

import com.furkankaya.config.PasswordEncoderConfig;
import com.furkankaya.dto.CreateUserRequest;
import com.furkankaya.dto.UserResponse;
import com.furkankaya.model.Role;
import com.furkankaya.model.User;
import com.furkankaya.service.MailService;
import com.furkankaya.service.MqttService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserConverter {

    private final PasswordEncoderConfig passwordEncoderConfig;
    private final MailService mailService;
    private final MqttService mqttService;

    public UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .username(user.getUsername())
                .roles(user.getAuthorities())
                .build();
    }

    public User toUser(CreateUserRequest request) {
        User user = new User();
        String uuid = UUID.randomUUID().toString();

        String newUUID = uuid.replace("-","");
        String randomPassword = newUUID.substring(0, 8);

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setInside(false);
        user.setEndDate(request.endDate());
        user.setUuid(uuid);
        user.setPassword(passwordEncoderConfig.passwordEncoder().encode(randomPassword));
        user.setAuthorities(Collections.singleton(Role.ROLE_USER));

        // Store password to return to admin — send email silently, don't crash if SMTP fails
        try {
            mailService.sendMail(request.email(),
                "Welcome to IronPeak Gym! 🏋️\n\nYour login credentials:\nEmail: " + request.email() +
                "\nPassword: " + randomPassword +
                "\n\nPlease change your password after first login.\n\nIronPeak Gym, Kolkata");
        } catch (Exception ignored) {
            // SMTP failure must not prevent member creation
        }
        mqttService.publishMessage(uuid);
        return user;
    }

}
