package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
    boolean existsByRoleId(Long roleId);
}