package com.furkankaya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

public record PaymentRequest(
        @NotBlank @Email String memberEmail,
        @NotBlank @Pattern(regexp = "^(1 Month|3 Months|6 Months|12 Months)$") String plan,
        @NotNull @Positive Long amount,
        @NotBlank @Pattern(regexp = "^(Cash|UPI|Card|Bank Transfer)$") String paymentMode,
        @Size(max = 500) String remarks
) {}
