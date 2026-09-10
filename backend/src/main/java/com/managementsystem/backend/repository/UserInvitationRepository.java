package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.UserInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import com.managementsystem.backend.model.User;

public interface UserInvitationRepository extends JpaRepository<UserInvitation, Long> {
    Optional<UserInvitation> findByTokenHash(String tokenHash);
    void deleteByUser(User user);
}