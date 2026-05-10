package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.TaskState;
import com.managementsystem.backend.repository.TaskStateRepository;

@Service
@RequiredArgsConstructor
public class TaskStateService {

    private final TaskStateRepository taskStateRepository;

    public TaskState createTaskState(TaskState taskState) {
        return taskStateRepository.save(taskState);
    }
}