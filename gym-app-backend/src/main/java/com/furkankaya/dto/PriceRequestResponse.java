package com.furkankaya.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record PriceRequestResponse(
        @NotNull @Positive Long oneMonths,
        @NotNull @Positive Long threeMonths,
        @NotNull @Positive Long sixMonths,
        @NotNull @Positive Long twelveMonths) {
}
