package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewProjectDTO;
import com.managementsystem.backend.model.Project;
import com.managementsystem.backend.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor

public class ProjectController {

    private final ProjectService service;

    @PostMapping
    public String createProject(@RequestBody NewProjectDTO dto) {
        service.createProject(Project.builder()
            .title(dto.title())
            .deadline(dto.deadline())
            .description(dto.description())
            .build()
        );
        return "Project created successfully";
    }
}