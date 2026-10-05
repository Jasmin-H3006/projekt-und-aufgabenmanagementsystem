package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewProjectDTO;
import com.managementsystem.backend.model.Project;
import com.managementsystem.backend.model.Customer;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.CustomerContactPerson;
import com.managementsystem.backend.service.ProjectService;
import com.managementsystem.backend.service.CustomerService;
import com.managementsystem.backend.service.UserService;
import com.managementsystem.backend.service.CustomerContactPersonService;
import com.managementsystem.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Set;
import java.util.HashSet;
import java.util.Objects;
import java.util.stream.Collectors;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor

public class ProjectController {

    private final ProjectService service;
    private final CustomerService customerService;
    private final UserService userService;
    private final CustomerContactPersonService contactPersonService;
    private final UserRepository userRepository;

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody NewProjectDTO dto) {
        if (service.projectExists(dto.title(), dto.deadline(), dto.customerId())) {
            return ResponseEntity.status(409).build();
        }

        Customer customer = customerService.getCustomerById(dto.customerId());
        User projectManager = userService.getUserById(dto.projectManagerId());

        Set<User> users = dto.userIds() == null
            ? new HashSet<>()
            : dto.userIds().stream()
                .map(userService::getUserById)
                .collect(Collectors.toSet());

        Set<CustomerContactPerson> contactPersons = dto.contactPersonIds() == null
            ? new HashSet<>()
            : dto.contactPersonIds().stream()
                .map(contactPersonService::getContactPersonById)
                .collect(Collectors.toSet());

        return ResponseEntity.ok(
            service.createProject(Project.builder()
                .title(dto.title())
                .deadline(dto.deadline())
                .description(dto.description())
                .customer(customer)
                .projectManager(projectManager)
                .users(users)
                .contactPersons(contactPersons)
                .build()
            )
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody NewProjectDTO dto) {
        Project existing = service.getProjectById(id);

        // Check if the combination of title, customer and deadline has changed and if the new combination already exists
        boolean combinationChanged = !existing.getTitle().equals(dto.title())
            || !Objects.equals(existing.getDeadline(), dto.deadline())
            || !existing.getCustomer().getId().equals(dto.customerId());

        if (combinationChanged && service.projectExists(dto.title(), dto.deadline(), dto.customerId())) {
            return ResponseEntity.status(409).build();
        }

        Customer customer = customerService.getCustomerById(dto.customerId());
        User projectManager = userService.getUserById(dto.projectManagerId());

        Set<User> users = dto.userIds() == null
            ? new HashSet<>()
            : dto.userIds().stream()
                .map(userService::getUserById)
                .collect(Collectors.toSet());

        Set<CustomerContactPerson> contactPersons = dto.contactPersonIds() == null
            ? new HashSet<>()
            : dto.contactPersonIds().stream()
                .map(contactPersonService::getContactPersonById)
                .collect(Collectors.toSet());

        existing.setTitle(dto.title());
        existing.setDeadline(dto.deadline());
        existing.setDescription(dto.description());
        existing.setCustomer(customer);
        existing.setProjectManager(projectManager);
        existing.setUsers(users);
        existing.setContactPersons(contactPersons);

        return ResponseEntity.ok(service.createProject(existing));
    }

    @PutMapping("/{id}/update-archived-state")
    public ResponseEntity<Project> updateProjectArchivedState(@PathVariable Long id, @RequestBody NewProjectDTO dto) {
       Project existing = service.getProjectById(id);
       existing.setArchived(dto.archived());
       return ResponseEntity.ok(service.createProject(existing));
    }

    @GetMapping("/get-all")
    public List<Project> getAllProjects() {
        return service.getAllProjects();
    }

    @GetMapping("/get-my-projects")
    public List<Project> getMyProjects(@RequestParam Long userId) {
        return service.getMyProjects(userId);
    }

    @GetMapping("/get-other-projects")
    public List<Project> getOtherProjects(@RequestParam Long userId) {
        return service.getOtherProjects(userId);
    }

    @GetMapping("/project-exists")
    public ResponseEntity<Boolean> projectExists(@RequestParam String title, @RequestParam(required = false) String deadline, @RequestParam Long customerId) {
        java.time.LocalDate parsedDeadline = (deadline == null || deadline.isEmpty()) ? null : java.time.LocalDate.parse(deadline);
        return ResponseEntity.ok(service.projectExists(title, parsedDeadline, customerId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id, HttpSession session) {
        String username = (String) session.getAttribute("username");

        if (username == null) {
            return ResponseEntity.status(401).build(); // Unauthorized
        }

        User user = userRepository.findByUsername(username);
        Project project = service.getProjectById(id);

        if (!service.canAccessProject(user, project)) {
            return ResponseEntity.status(403).build(); // Forbidden
        }

        return ResponseEntity.ok(project);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        service.deleteProject(id);
        return ResponseEntity.noContent().build();
    }
}