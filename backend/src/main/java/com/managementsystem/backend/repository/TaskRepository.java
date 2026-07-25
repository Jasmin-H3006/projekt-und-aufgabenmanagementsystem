package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {
    Task findByTitle(String title);
    boolean existsByTitle(String title);
    List<Task> findByProjectId(Long projectId);
}