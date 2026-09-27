package com.furkankaya.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data @Builder @AllArgsConstructor @NoArgsConstructor
public class InterestFormResponse {
    private Long id;
    private String fullName;
    private String email;
    private String phone;
    private String age;
    private String gender;
    private String fitnessGoal;
    private String message;
    private String status;
    private LocalDateTime submittedAt;
    private LocalDateTime approvedAt;
}
