package com.furkankaya.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Builder;

@Builder
public record UUIDRequest(@NotBlank @Size(max = 128) String uuid) {
}
