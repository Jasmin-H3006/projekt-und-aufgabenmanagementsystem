package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewTaskDTO;
import com.managementsystem.backend.model.Task;
import com.managementsystem.backend.service.TaskService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor

public class TaskController {

    private final TaskService service;

    @PostMapping
    public String createTask(@RequestBody NewTaskDTO dto) {
        service.createTask(Task.builder()
            .title(dto.title())
            .description(dto.description())
            .build()

        );
        return "Task created successfully";
    }
}