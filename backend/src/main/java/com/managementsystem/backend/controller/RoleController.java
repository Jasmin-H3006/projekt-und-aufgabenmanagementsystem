package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewRoleDTO;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor

public class RoleController {

    private final RoleService service;

    @PostMapping("/create")
    public String createRole(@RequestBody NewRoleDTO dto) {
        service.createRole(Role.builder()
            .name(dto.name())
            .adminAccess(dto.adminAccess())
            .allProjectsAccess(dto.allProjectsAccess())
            .createProjectsAccess(dto.createProjectsAccess())
            .editAvailableProjectsAccess(dto.editAvailableProjectsAccess())
            .createAndEditTasksAccess(dto.createAndEditTasksAccess())
            .customerPageAccess(dto.customerPageAccess())
            .build()
        );
        return "Role created successfully";
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody NewRoleDTO dto) {
        Role existing = service.getRoleById(id);

        // Check if name is being changed and if the new name already exists
        if (!existing.getName().equals(dto.name()) && service.roleExists(dto.name())) {
            return ResponseEntity.status(409).build();
        }

        existing.setName(dto.name());
        existing.setAdminAccess(dto.adminAccess());
        existing.setAllProjectsAccess(dto.allProjectsAccess());
        existing.setCreateProjectsAccess(dto.createProjectsAccess());
        existing.setEditAvailableProjectsAccess(dto.editAvailableProjectsAccess());
        existing.setCreateAndEditTasksAccess(dto.createAndEditTasksAccess());
        existing.setCustomerPageAccess(dto.customerPageAccess());

        return ResponseEntity.ok(service.createRole(existing));
    }

    @GetMapping("/get-all")
    public List<Role> getAllRoles() {
        return service.getAllRoles();
    }

    @GetMapping("/role-exists")
    public ResponseEntity<Boolean> roleExists(@RequestParam String name) {
        return ResponseEntity.ok(service.roleExists(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Role> getRoleById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getRoleById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        service.deleteRole(id);
        return ResponseEntity.noContent().build();
    }
}