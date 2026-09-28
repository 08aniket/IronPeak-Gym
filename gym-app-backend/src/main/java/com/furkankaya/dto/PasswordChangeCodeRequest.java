package com.furkankaya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record PasswordChangeCodeRequest(
        @NotBlank @Pattern(regexp = "\\d{6}") String verificationCode) {
}