package com.furkankaya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record MeasurementRequestResponse(
        @NotBlank @Email String email,
        @NotNull @Positive Integer height,
        @NotNull @Positive Integer weight,
        @NotNull @Positive Integer chest,
        @NotNull @Positive Integer waist,
        @NotNull @Positive Integer hip
) {
}
