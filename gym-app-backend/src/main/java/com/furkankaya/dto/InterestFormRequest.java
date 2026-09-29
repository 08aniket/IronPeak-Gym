package com.furkankaya.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record InterestFormRequest(
    @NotBlank @Size(max = 120) String fullName,
    @NotBlank @Email @Size(max = 254) String email,
    @Size(min = 7, max = 20) String phone,
    @Pattern(regexp = "^(?:|[1-9][0-9]?|100)$") String age,
    @Size(max = 50) String gender,
    @Size(max = 100) String fitnessGoal,
    @Size(max = 2000) String message
) {}
