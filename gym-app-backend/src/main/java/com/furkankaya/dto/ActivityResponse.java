package com.furkankaya.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityResponse {
    private String type;       // PAYMENT, NEW_MEMBER, REMINDER
    private String description;
    private String memberName;
    private LocalDate date;
    private String icon;
}
