package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.Task;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.repository.TaskRepository;

@Service
@RequiredArgsConstructor
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectService projectService;

    public Task createTask(Task task) {
        return taskRepository.save(task);
    }

    public java.util.List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public java.util.List<Task> getTasksByProjectId(Long projectId) {
        return taskRepository.findByProjectId(projectId);
    }

    public boolean taskExistsByTitleAndProjectId(String title, Long projectId) {
        return taskRepository.existsByTitleAndProjectId(title, projectId);
    }

    public Task getTaskById(Long id) {
        return taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Task not found"));
    }

    public boolean canAccessTask(User user, Task task) {
        return projectService.canAccessProject(user, task.getProject());
    }

    public void deleteTask(Long id) {
        taskRepository.deleteById(id);
    }
}