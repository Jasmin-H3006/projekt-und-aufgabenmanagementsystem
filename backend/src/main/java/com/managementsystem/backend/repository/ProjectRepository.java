package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    Project findByTitle(String title);
    boolean existsByTitleAndDeadlineAndCustomerId(String title, java.time.LocalDate deadline, Long customerId);

    @Query("SELECT DISTINCT p FROM Project p LEFT JOIN p.users u WHERE u.id = :userId OR p.projectManager.id = :userId")
    List<Project> findByUserId(@Param("userId") Long userId);

    @Query("SELECT p FROM Project p WHERE p.projectManager.id != :userId AND p.id NOT IN (SELECT p2.id FROM Project p2 JOIN p2.users u WHERE u.id = :userId)")
    List<Project> findByNotUserId(@Param("userId") Long userId);
}