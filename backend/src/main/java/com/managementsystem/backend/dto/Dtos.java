package com.managementsystem.backend.dto;

import lombok.Builder;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;

public interface Dtos {
    @Builder
    public record NewUserDTO(
        @NotEmpty String username,
        @NotEmpty String password,
        @NotEmpty String role
    ) {}
    @Builder
    public record NewRoleDTO(
        @NotEmpty String name
    ) {}
    @Builder
    public record NewCustomerDTO(
        @NotEmpty String name,
        @NotEmpty String website
    ) {}
    @Builder
    public record NewCustomerContactPersonDTO(
        @NotEmpty String name,
        @NotEmpty String email,
        @NotEmpty Long telefone
    ) {}
    @Builder
    public record NewTaskDTO(
        @NotEmpty String title,
        @NotEmpty String description
    ) {}
    @Builder
    public record NewTaskStateDTO(
        @NotEmpty String name
    ) {}
    @Builder
    public record NewProjectDTO(
        @NotEmpty String title,
        @NotNull LocalDate deadline,
        @NotEmpty String description
    ) {}
}