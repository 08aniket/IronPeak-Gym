package com.furkankaya.dto;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ActivityLogResponse {
    private Long id;
    private String eventType;
    private String description;
    private String memberName;
    private LocalDateTime createdAt;
}
