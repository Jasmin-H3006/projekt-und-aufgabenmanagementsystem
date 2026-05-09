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
        @NotEmpty Long telefone,
        @NotEmpty String jobDescription
    ) {}

}