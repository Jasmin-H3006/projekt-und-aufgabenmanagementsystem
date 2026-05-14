package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.repository.UserRepository;
import com.managementsystem.backend.repository.RoleRepository;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public boolean adminExists() {
        Role adminRole = roleRepository.findByName("Admin");
        return adminRole != null && userRepository.existsByRoleId(adminRole.getId());
    }

    public ResponseEntity<String> registerAdmin(NewUserDTO dto) {
        // Admin-Registration at Log-in Page is not possible if there is already an Admin in the database

        // If there is no Admin in the database, the first registered user will be assigned the Admin role
        Role adminRole = roleRepository.findByName("Admin");

        if (adminRole != null && userRepository.existsByRoleId(adminRole.getId())) {
            return ResponseEntity.status(409).body("An Admin user already exists. Please log in with the existing Admin account or contact your administrator.");
        }

        // Create Admin role if it doesn't exist
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setName("Admin");
            adminRole = roleRepository.save(adminRole);
        }

        User u = new User();
        u.setUsername(dto.username());
        u.setPassword(dto.password());
        u.setRole(adminRole);
        userRepository.save(u);

        return ResponseEntity.ok("Admin registered successfully");
    }
}