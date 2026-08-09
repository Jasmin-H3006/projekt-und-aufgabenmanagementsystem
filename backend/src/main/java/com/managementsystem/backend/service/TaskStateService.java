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

    public java.util.List<TaskState> getAllTaskStates() {
        return taskStateRepository.findAll();
    }

    public boolean taskStateExists(String name) {
        return taskStateRepository.existsByName(name);
    }

    public TaskState getTaskStateById(Long id) {
        return taskStateRepository.findById(id).orElseThrow(() -> new RuntimeException("Task state not found"));
    }

    public void deleteTaskState(Long id) {
        taskStateRepository.deleteById(id);
    }
}