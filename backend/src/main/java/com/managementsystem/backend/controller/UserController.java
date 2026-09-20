package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import com.managementsystem.backend.dto.Dtos.NewUserInvitationDTO;
import com.managementsystem.backend.dto.Dtos.ActivateUserDTO;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.model.UserStatus;
import com.managementsystem.backend.service.UserService;
import com.managementsystem.backend.service.RoleService;
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

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {

    private final UserService service;
    private final RoleService roleService;

    @PostMapping("/create")
    public ResponseEntity<NewUserInvitationDTO> createUser(@RequestBody NewUserDTO dto) {
        Role role = roleService.getRoleById(dto.roleId());

        User user = User.builder()
            .username(dto.username())
            .password(null)
            .status(UserStatus.INVITED)
            .role(role)
            .build();

        return ResponseEntity.ok(service.createUser(user));
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
        existing.setRole(role);

        return ResponseEntity.ok(service.updateUser(existing));
    }

    @PutMapping("/{id}/activate")
    public ResponseEntity<User> activateUser(@PathVariable Long id, @RequestBody ActivateUserDTO dto) {
        service.activateUser(id, dto.token(), dto.password());
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{id}/reset-password")
    public ResponseEntity<NewUserInvitationDTO> resetUserPassword(@PathVariable Long id) {
        User existing = service.getUserById(id);
        return ResponseEntity.ok(service.resetPassword(existing));
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