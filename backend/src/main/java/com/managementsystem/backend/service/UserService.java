package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.repository.UserRepository;
import java.util.List;
import org.springframework.transaction.annotation.Transactional;
import com.managementsystem.backend.model.UserStatus;
import com.managementsystem.backend.service.UserInvitationService;
import com.managementsystem.backend.dto.Dtos.NewUserInvitationDTO;
import com.managementsystem.backend.service.UserInvitationService.CreatedInvitation;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserInvitationService userInvitationService;

    public NewUserInvitationDTO createUser(User user) {
        User savedUser = userRepository.save(user);

        if (savedUser.getStatus() != UserStatus.INVITED) return null;

        // Create token
        CreatedInvitation invitation = userInvitationService.createInvitation(savedUser);

        String registrationLink = "http://localhost:5173/src/pages/registrate-user/registrate-user.html?token=" + invitation.token();

        return new NewUserInvitationDTO(
            savedUser.getId(),
            registrationLink,
            invitation.expiresAt(),
            invitation.usedAt(),
            invitation.createdAt()
        );
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public NewUserInvitationDTO resetPassword(User user) {
        // Reset Invitation token and password
        userInvitationService.deleteInvitationsForUser(user);
        user.setPassword(null);
        user.setStatus(UserStatus.INVITED);

        User savedUser = userRepository.save(user);
        CreatedInvitation invitation = userInvitationService.createInvitation(savedUser);
        String registrationLink = "http://localhost:5173/src/pages/registrate-user/registrate-user.html?token=" + invitation.token();
        return new NewUserInvitationDTO(savedUser.getId(), registrationLink, invitation.expiresAt(), invitation.usedAt(), invitation.createdAt());
    }

    public java.util.List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public boolean userExists(String username) {
        return userRepository.existsByUsername(username);
    }

    public User getUserById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}