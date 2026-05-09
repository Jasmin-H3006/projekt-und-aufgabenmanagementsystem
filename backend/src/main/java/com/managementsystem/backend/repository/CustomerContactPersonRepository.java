package com.managementsystem.backend.repository;

import com.managementsystem.backend.model.CustomerContactPerson;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerContactPersonRepository extends JpaRepository<CustomerContactPerson, Long> {
    CustomerContactPerson findByName(String name);
}