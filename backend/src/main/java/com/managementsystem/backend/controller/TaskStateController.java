package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewTaskStateDTO;
import com.managementsystem.backend.model.TaskState;
import com.managementsystem.backend.service.TaskStateService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/task-states")
@RequiredArgsConstructor

public class TaskStateController {

    private final TaskStateService service;

    @PostMapping
    public String createTaskState(@RequestBody NewTaskStateDTO dto) {
        service.createTaskState(TaskState.builder()
            .name(dto.name())
            .build()
        );
        return "Task state created successfully";
    }
}