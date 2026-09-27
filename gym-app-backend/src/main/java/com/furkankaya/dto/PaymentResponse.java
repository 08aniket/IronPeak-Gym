package com.furkankaya.dto;

import lombok.*;
import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class PaymentResponse {
    private Long id;
    private String receiptNumber;
    private String memberEmail;
    private String memberName;
    private String plan;
    private Long amount;
    private String paymentMode;
    private LocalDate paymentDate;
    private String remarks;
    private String gymName;
}
