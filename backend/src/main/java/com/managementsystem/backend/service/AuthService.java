package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.repository.UserRepository;
import com.managementsystem.backend.repository.RoleRepository;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public boolean adminExists() {
        // Check if there is already an user with a role that has admin access
        return userRepository.existsByRole_AdminAccessTrue();
    }

    public ResponseEntity<String> registerAdmin(NewUserDTO dto) {
        // Admin-Registration at Log-in Page is not possible if there is already an Admin in the database
        if (adminExists()) {
            return ResponseEntity.status(409).body("An Admin user already exists. Please log in with the existing Admin account or contact your administrator.");
        }

        // If there is no Role named "Admin" in the database, the first registered user will be assigned to an new role "Admin"
        Role adminRole = roleRepository.findByName("Admin");
        String adminRoleName = (adminRole == null) ? "Admin" : "Admin-Neu";

        // Create Admin role if it doesn't exist
        if (adminRole == null) {
            adminRole = new Role();
            adminRole.setName(adminRoleName);
            adminRole.setAdminAccess(true);
            adminRole.setAllProjectsAccess(true);
            adminRole.setCreateProjectsAccess(true);
            adminRole.setEditAvailableProjectsAccess(true);
            adminRole.setCreateAndEditTasksAccess(true);
            adminRole.setCustomerPageAccess(true);
            adminRole = roleRepository.save(adminRole);
        }

        User u = new User();
        u.setUsername(dto.username());
        u.setPassword(passwordEncoder.encode(dto.password()));
        u.setRole(adminRole);
        userRepository.save(u);

        return ResponseEntity.ok("Admin registered successfully");
    }
}