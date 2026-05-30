package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewRoleDTO;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.service.RoleService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor

public class RoleController {

    private final RoleService service;

    @PostMapping("/create")
    public String createRole(@RequestBody NewRoleDTO dto) {
        service.createRole(Role.builder()
            .name(dto.name())
            .build()
        );
        return "Role created successfully";
    }

    @GetMapping("/get-all")
    public List<Role> getAllRoles() {
        return service.getAllRoles();
    }

    @GetMapping("/role-exists")
    public ResponseEntity<Boolean> roleExists(@RequestParam String name) {
        return ResponseEntity.ok(service.roleExists(name));
    }
}