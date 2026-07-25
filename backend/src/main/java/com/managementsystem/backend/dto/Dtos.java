package com.managementsystem.backend.dto;

import lombok.Builder;
import jakarta.validation.constraints.NotEmpty;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;
import com.managementsystem.backend.model.Role;

public interface Dtos {
    @Builder
    public record NewUserDTO(
        @NotEmpty String username,
        String password,
        @NotEmpty Long roleId
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
        @NotEmpty Long projectId
    ) {}
    @Builder
    public record NewTaskStateDTO(
        @NotEmpty String name
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
        String username,
        boolean adminAccess,
        boolean allProjectsAccess,
        boolean createProjectsAccess,
        boolean editAvailableProjectsAccess,
        boolean createAndEditTasksAccess,
        boolean customerPageAccess
    ) {}
}