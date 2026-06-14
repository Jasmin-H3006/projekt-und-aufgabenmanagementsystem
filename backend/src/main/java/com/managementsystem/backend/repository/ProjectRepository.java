package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByTitle(String title);
    boolean existsByTitleAndDeadlineAndCustomerId(String title, java.time.LocalDate deadline, Long customerId);
}