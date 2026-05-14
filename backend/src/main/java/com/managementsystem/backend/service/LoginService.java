package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.repository.UserRepository;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import org.springframework.http.ResponseEntity;

@Service
@RequiredArgsConstructor
public class LoginService {

    private final UserRepository userRepository;

    public ResponseEntity<String> loginUser(NewUserDTO dto) {
        User existingUser = userRepository.findByUsername(dto.username());

        // Check if user exists
        if (existingUser == null) {
            return ResponseEntity.status(409).body("This username does not exist. Please contact your administrator to create an account for you.");
        }

        // Check if there is already a password set for the user
        if (existingUser.getPassword() != null) {
            // Check password
            if (!existingUser.getPassword().equals(dto.password())) {
                return ResponseEntity.status(401).body("Wrong password. Please try again.");
            } else {
                return ResponseEntity.ok("Login successful");
            }
        } else {
            // Set password
            existingUser.setPassword(dto.password());
            userRepository.save(existingUser);
            return ResponseEntity.ok("Password set successfully. Login successful.");
        }
    }
}