package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.TaskState;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TaskStateRepository extends JpaRepository<TaskState, Long> {
    TaskState findByName(String name);
    boolean existsByName(String name);
}