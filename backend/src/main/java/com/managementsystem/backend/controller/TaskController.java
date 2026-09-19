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
import com.managementsystem.backend.service.TaskStateService;
import com.managementsystem.backend.model.TaskState;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.repository.UserRepository;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor

public class TaskController {

    private final TaskService service;
    private final ProjectService projectService;
    private final TaskStateService taskStateService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public String createTask(@RequestBody NewTaskDTO dto) {
        Project project = projectService.getProjectById(dto.projectId());
        TaskState taskState = taskStateService.getTaskStateById(dto.taskStateId());

        service.createTask(Task.builder()
            .title(dto.title())
            .description(dto.description())
            .project(project)
            .taskState(taskState)
            .build()
        );
        return "Task created successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody NewTaskDTO dto) {
        Task existing = service.getTaskById(id);
        Project project = projectService.getProjectById(dto.projectId());
        TaskState taskState = taskStateService.getTaskStateById(dto.taskStateId());

        // Check if title is being changed and if the new title already exists
        if (!existing.getTitle().equals(dto.title()) && service.taskExistsByTitleAndProjectId(dto.title(), dto.projectId())) {
            return ResponseEntity.status(409).build();
        }

        existing.setTitle(dto.title());
        existing.setDescription(dto.description());
        existing.setProject(project);
        existing.setTaskState(taskState);

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

    @GetMapping("/task-exists-in-project")
    public ResponseEntity<Boolean> taskExistsInProject(@RequestParam String title, @RequestParam Long projectId) {
        return ResponseEntity.ok(service.taskExistsByTitleAndProjectId(title, projectId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id, HttpSession session) {

        String username = (String) session.getAttribute("username");
        if (username == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        User user = userRepository.findByUsername(username);
        Task task = service.getTaskById(id);

        if (!service.canAccessTask(user, task)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(task);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        service.deleteTask(id);
        return ResponseEntity.noContent().build();
    }
}