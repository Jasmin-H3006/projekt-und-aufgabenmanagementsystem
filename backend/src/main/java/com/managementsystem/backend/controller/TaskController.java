package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewTaskDTO;
import com.managementsystem.backend.model.Task;
import com.managementsystem.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.managementsystem.backend.model.Project;
import com.managementsystem.backend.service.ProjectService;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor

public class TaskController {

    private final TaskService service;
    private final ProjectService projectService;

    @PostMapping("/create")
    public String createTask(@RequestBody NewTaskDTO dto) {
        service.createTask(Task.builder()
            .title(dto.title())
            .description(dto.description())
            .build()
        );
        return "Task created successfully";
    }


    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody NewTaskDTO dto) {
        Task existing = service.getTaskById(id);
        Project project = projectService.getProjectById(dto.projectId());

        // Check if title is being changed and if the new title already exists
        if (!existing.getTitle().equals(dto.title()) && service.taskExists(dto.title())) {
            return ResponseEntity.status(409).build();
        }

        existing.setTitle(dto.title());
        existing.setDescription(dto.description());
        existing.setProject(project);

        return ResponseEntity.ok(service.createTask(existing));
    }

    @GetMapping("/get-all")
    public List<Task> getAllTasks() {
        return service.getAllTasks();
    }

    @GetMapping("/projects/{projectId}")
    public List<Task> getTasksByProjectId(@PathVariable Long projectId) {
        return service.getTasksByProjectId(projectId);
    }

    @GetMapping("/task-exists")
    public ResponseEntity<Boolean> taskExists(@RequestParam String title) {
        return ResponseEntity.ok(service.taskExists(title));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTaskById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}