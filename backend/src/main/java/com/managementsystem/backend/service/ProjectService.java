package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.Project;
import com.managementsystem.backend.repository.ProjectRepository;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;

    public Project createProject(Project project) {
        return projectRepository.save(project);
    }

    public java.util.List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public boolean projectExists(String title, java.time.LocalDate deadline, Long customerId) {
        return projectRepository.existsByTitleAndDeadlineAndCustomerId(title, deadline, customerId);
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }
}