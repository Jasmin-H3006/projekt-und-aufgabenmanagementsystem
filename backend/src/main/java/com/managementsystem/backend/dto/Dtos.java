package com.managementsystem.backend.dto;

import lombok.Builder;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import com.managementsystem.backend.model.Role;
import java.time.Instant;

public interface Dtos {
    @Builder
    public record NewUserDTO(
        @NotEmpty String username,
        @NotEmpty String password,
        @NotNull String status,
        @NotEmpty Long roleId
    ) {}
    @Builder
    public record NewUserInvitationDTO(
        @NotEmpty Long userId,
        @NotEmpty String registrationLink,
        @NotEmpty Instant expiresAt,
        @NotEmpty Instant usedAt,
        @NotEmpty Instant createdAt
    ) {}
    @Builder
    public record ActivateUserDTO(
        @NotEmpty String token,
        @NotEmpty String password
    ) {}
    @Builder
    public record NewRoleDTO(
        @NotEmpty String name,
        @NotEmpty Boolean adminAccess,
        Boolean allProjectsAccess,
        Boolean createProjectsAccess,
        Boolean editAvailableProjectsAccess,
        Boolean createAndEditTasksAccess,
        Boolean customerPageAccess
    ) {}
    @Builder
    public record NewCustomerDTO(
        @NotEmpty String name,
        String website
    ) {}
    @Builder
    public record NewCustomerContactPersonDTO(
        @NotEmpty String name,
        @NotEmpty String email,
        String telefone,
        @NotEmpty Long customerId
    ) {}
    @Builder
    public record NewTaskDTO(
        @NotEmpty String title,
        @NotEmpty String description,
        @NotEmpty Long projectId,
        @NotNull Long taskStateId
    ) {}
    @Builder
    public record NewTaskStateDTO(
        @NotEmpty String name,
        @NotEmpty String color,
        @NotEmpty Boolean fontColorBlack,
        @NotEmpty Boolean taskDoneState
    ) {}
    @Builder
    public record NewProjectDTO(
        @NotEmpty String title,
        LocalDate deadline,
        @NotEmpty String description,
        @NotEmpty Long customerId,
        @NotEmpty Long projectManagerId,
        java.util.List<Long> userIds,
        @NotEmpty java.util.List<Long> contactPersonIds
    ) {}
    @Builder
    public record CurrentUserDTO(
        Long id,
        String username,
        boolean adminAccess,
        boolean allProjectsAccess,
        boolean createProjectsAccess,
        boolean editAvailableProjectsAccess,
        boolean createAndEditTasksAccess,
        boolean customerPageAccess,
        String userStatus
    ) {}
}