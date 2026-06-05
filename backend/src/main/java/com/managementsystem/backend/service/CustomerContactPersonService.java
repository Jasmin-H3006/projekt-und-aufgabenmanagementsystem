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

    public java.util.List<CustomerContactPerson> getAllContactPersons() {
        return customerContactPersonRepository.findAll();
    }

    public java.util.List<CustomerContactPerson> getContactPersonsByCustomerId(Long customerId) {
        return customerContactPersonRepository.findByCustomerId(customerId);
    }

    public boolean contactPersonExists(String email) {
        return customerContactPersonRepository.existsByEmail(email);
    }

    public CustomerContactPerson getContactPersonById(Long id) {
        return customerContactPersonRepository.findById(id).orElseThrow(() -> new RuntimeException("Contact person not found"));
    }

    public void deleteContactPerson(Long id) {
        customerContactPersonRepository.deleteById(id);
    }
}