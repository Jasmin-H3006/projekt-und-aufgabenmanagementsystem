package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewTaskStateDTO;
import com.managementsystem.backend.model.TaskState;
import com.managementsystem.backend.service.TaskStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/task-states")
@RequiredArgsConstructor

public class TaskStateController {

    private final TaskStateService service;

    @PostMapping("/create")
    public String createTaskState(@RequestBody NewTaskStateDTO dto) {
        service.createTaskState(TaskState.builder()
            .name(dto.name())
            .color(dto.color())
            .build()
        );
        return "Task state created successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskState> updateTaskState(@PathVariable Long id, @RequestBody NewTaskStateDTO dto) {
        TaskState existing = service.getTaskStateById(id);

        // Check if name is being changed and if the new name already exists
        if (!existing.getName().equals(dto.name()) && service.taskStateExists(dto.name())) {
            return ResponseEntity.status(409).build();
        }

        existing.setName(dto.name());
        existing.setColor(dto.color());

        return ResponseEntity.ok(service.createTaskState(existing));
    }

    @GetMapping("/get-all")
    public List<TaskState> getAllTaskStates() {
        return service.getAllTaskStates();
    }

    @GetMapping("/task-state-exists")
    public ResponseEntity<Boolean> taskStateExists(@RequestParam String name) {
        return ResponseEntity.ok(service.taskStateExists(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<TaskState> getTaskStateById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getTaskStateById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTaskState(@PathVariable Long id) {
        service.deleteTaskState(id);
        return ResponseEntity.noContent().build();
    }
}