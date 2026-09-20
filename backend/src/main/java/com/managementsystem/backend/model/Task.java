package com.managementsystem.backend.model;

import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Column;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.UniqueConstraint;
import java.util.Set;
import java.util.HashSet;

@Entity

// @Data bei JPA vermeiden
@Getter
@Setter

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "task", uniqueConstraints = { @UniqueConstraint(columnNames = {"title", "project_id"})})

public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    // FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "state_id", nullable = false)
    private TaskState taskState;

    // FK
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // Join with User-Table
    @ManyToMany(mappedBy = "tasks")
    private Set<User> users = new HashSet<>();
}