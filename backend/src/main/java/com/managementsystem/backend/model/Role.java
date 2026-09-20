package com.managementsystem.backend.model;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "role")

public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @Builder.Default
    private Boolean adminAccess = false;
    private Boolean allProjectsAccess = false;
    private Boolean createProjectsAccess = false;
    private Boolean editAvailableProjectsAccess = false;
    private Boolean createAndEditTasksAccess = false;
    private Boolean customerPageAccess = false;
}
