package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewRoleDTO;
import com.managementsystem.backend.model.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.managementsystem.backend.service.RoleService;


@RestController
@RequestMapping("/api/roles")
@RequiredArgsConstructor

public class RoleController {

    private final RoleService service;

    @PostMapping
    public String createRole(@RequestBody NewRoleDTO dto) {
        service.createRole(Role.builder()
            .name(dto.name())
            .build()
        );
        return "Role created successfully";
    }
}