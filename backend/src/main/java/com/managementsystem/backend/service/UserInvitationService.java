package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.User;
import com.managementsystem.backend.model.UserInvitation;
import com.managementsystem.backend.repository.UserInvitationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class UserInvitationService {

    private final SecureRandom secureRandom = new SecureRandom();
    private final UserInvitationRepository userInvitationRepository;

    // Generate Token
    public String generateToken() {
        byte[] bytes = new byte[32];
        secureRandom.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    // Hash Token
    public String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return Base64.getUrlEncoder()
                    .withoutPadding()
                    .encodeToString(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 not available", e);
        }
    }

    public record CreatedInvitation(
            String token,
            Instant expiresAt,
            Instant usedAt,
            Instant createdAt
    ) {}
    // Create and save invitation
    public CreatedInvitation createInvitation(User user) {
        // Generate (not hashed) token
        String token = generateToken();
        // Hash token
        String tokenHash = hashToken(token);

        // Expires after 24 hours
        Instant expiresAt = Instant.now().plus(24, ChronoUnit.HOURS);

        // Create invitation
        UserInvitation invitation = UserInvitation.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiresAt(expiresAt)
                .usedAt(null)
                .createdAt(Instant.now())
                .build();

        // Save invitation
        userInvitationRepository.save(invitation);
        // Set usedAt to null initially
        invitation.setUsedAt(null);

        // Return not hashed token
        return new CreatedInvitation(token, expiresAt, invitation.getUsedAt(), invitation.getCreatedAt());
    }

    // Delete invitations
    public void deleteInvitationsForUser(User user) {
        userInvitationRepository.deleteByUser(user);
    }
}