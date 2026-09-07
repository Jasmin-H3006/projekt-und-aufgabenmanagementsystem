package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.service.UserService;
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
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.service.RoleService;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {

    private final UserService service;
    private final RoleService roleService;
    private final PasswordEncoder passwordEncoder;

    @PostMapping("/create")
    public String createUser(@RequestBody NewUserDTO dto) {
        Role role = roleService.getRoleById(dto.roleId());
        User.UserBuilder userBuilder = User.builder()
            .username(dto.username())
            .role(role);

        if (dto.password() != null && !dto.password().isBlank()) {
            userBuilder.password(passwordEncoder.encode(dto.password()));
        }

        service.createUser(userBuilder.build());
        return "User created successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody NewUserDTO dto) {
        User existing = service.getUserById(id);

        // Check if username is being changed and if the new username already exists
        if (!existing.getUsername().equals(dto.username()) && service.userExists(dto.username())) {
            return ResponseEntity.status(409).build();
        }

        Role role = roleService.getRoleById(dto.roleId());

        existing.setUsername(dto.username());
        if (dto.password() != null && !dto.password().isBlank()) {
            existing.setPassword(passwordEncoder.encode(dto.password()));
        }
        existing.setRole(role);

        return ResponseEntity.ok(service.createUser(existing));
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<User> resetUserPassword(@PathVariable Long id) {
        User existing = service.getUserById(id);

        existing.setPassword(null);

        return ResponseEntity.ok(service.createUser(existing));
    }

    @GetMapping("/get-all")
    public List<User> getAllUsers() {
        return service.getAllUsers();
    }

    @GetMapping("/user-exists")
    public ResponseEntity<Boolean> userExists(@RequestParam String username) {
        return ResponseEntity.ok(service.userExists(username));
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getUserById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}