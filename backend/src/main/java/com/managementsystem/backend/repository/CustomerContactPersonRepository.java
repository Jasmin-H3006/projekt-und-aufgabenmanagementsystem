package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.CustomerContactPerson;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CustomerContactPersonRepository extends JpaRepository<CustomerContactPerson, Long> {
    CustomerContactPerson findByName(String name);
    boolean existsByEmail(String email);
    List<CustomerContactPerson> findByCustomerId(Long customerId);
}