package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.Role;
import com.managementsystem.backend.repository.RoleRepository;

@Service
@RequiredArgsConstructor
public class RoleService {

    private final RoleRepository roleRepository;

    public Role createRole(Role role) {
        return roleRepository.save(role);
    }

    public java.util.List<Role> getAllRoles() {
        return roleRepository.findAll();
    }

    public boolean roleExists(String name) {
        return roleRepository.existsByName(name);
    }

    public Role getRoleById(Long id) {
        return roleRepository.findById(id).orElseThrow(() -> new RuntimeException("Role not found"));
    }

    public void deleteRole(Long id) {
        roleRepository.deleteById(id);
    }
}