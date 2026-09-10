package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.repository.UserRepository;
import com.managementsystem.backend.repository.RoleRepository;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.UserStatus;
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

        Role adminRole = roleRepository.findByAdminAccessTrue();
         if (adminRole == null) {
            Role newAdminRole = new Role();
             newAdminRole.setName("Admin-Neu");
             newAdminRole.setAdminAccess(true);
             newAdminRole.setAllProjectsAccess(true);
             newAdminRole.setCreateProjectsAccess(true);
             newAdminRole.setEditAvailableProjectsAccess(true);
             newAdminRole.setCreateAndEditTasksAccess(true);
             newAdminRole.setCustomerPageAccess(true);
             adminRole = roleRepository.save(newAdminRole);
         };

        User u = new User();
        u.setUsername(dto.username());
        u.setPassword(passwordEncoder.encode(dto.password()));
        u.setStatus(UserStatus.ACTIVE);
        u.setRole(adminRole);
        userRepository.save(u);

        return ResponseEntity.ok("Admin registered successfully");
    }
}