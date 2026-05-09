package com.managementsystem.backend.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import com.managementsystem.backend.model.CustomerContactPerson;
import com.managementsystem.backend.repository.CustomerContactPersonRepository;

@Service
@RequiredArgsConstructor
public class CustomerContactPersonService {

    private final CustomerContactPersonRepository customerContactPersonRepository;

    public CustomerContactPerson createCustomerContactPerson(CustomerContactPerson customerContactPerson) {
        return customerContactPersonRepository.save(customerContactPerson);
    }
}