package com.furkankaya.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MemberListResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private String uuid;
    private LocalDate createdDate;
    private LocalDate endDate;
    private boolean inside;
    private String status; // ACTIVE, EXPIRED, EXPIRING_SOON
    private Long daysLeft;
}
