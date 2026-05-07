package com.managementsystem.backend.dto;

import lombok.Builder;
import jakarta.validation.constraints.NotEmpty;

public interface Dtos {
    @Builder
    public record NewUserDTO(
        @NotEmpty String username,
        @NotEmpty String password,
        @NotEmpty String role
    ) {}
    @Builder
    public record CustomerDto(
        @NotEmpty String componyName,
        @NotEmpty String contactPersonName,
        @NotEmpty String contactPersonEmail
    ) {}
    @Builder
    public record RoleDto(
        @NotEmpty String name
    ) {}
}