package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewCustomerContactPersonDTO;
import com.managementsystem.backend.model.CustomerContactPerson;
import com.managementsystem.backend.model.Customer;
import com.managementsystem.backend.service.CustomerContactPersonService;
import com.managementsystem.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/customer/contact-persons")
@RequiredArgsConstructor

public class CustomerContactPersonController {

    private final CustomerContactPersonService service;
    private final CustomerService customerService;

    @PostMapping("/create")
    public String createCustomerContactPerson(@RequestBody NewCustomerContactPersonDTO dto) {
        Customer customer = customerService.getCustomerById(dto.customerId());
        service.createCustomerContactPerson(CustomerContactPerson.builder()
            .name(dto.name())
            .email(dto.email())
            .telefone(dto.telefone())
            .customer(customer)
            .build()
        );
        return "Contact person created successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerContactPerson> updateContactPerson(@PathVariable Long id, @RequestBody NewCustomerContactPersonDTO dto) {
        CustomerContactPerson existing = service.getContactPersonById(id);
        Customer customer = customerService.getCustomerById(dto.customerId());

        // Check if email is being changed and if the new email already exists
        if (!existing.getEmail().equals(dto.email()) && service.contactPersonExists(dto.email())) {
            return ResponseEntity.status(409).build();
        }

        existing.setName(dto.name());
        existing.setEmail(dto.email());
        existing.setTelefone(dto.telefone());
        existing.setCustomer(customer);

        return ResponseEntity.ok(service.createCustomerContactPerson(existing));
    }

    @GetMapping("/get-all")
    public List<CustomerContactPerson> getAllContactPersons() {
        return service.getAllContactPersons();
    }

    @GetMapping("/customer/{customerId}")
    public List<CustomerContactPerson> getContactPersonsByCustomerId(@PathVariable Long customerId) {
        return service.getContactPersonsByCustomerId(customerId);
    }

    @GetMapping("/contact-person-exists")
    public ResponseEntity<Boolean> contactPersonExists(@RequestParam String email) {
        return ResponseEntity.ok(service.contactPersonExists(email));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerContactPerson> getContactPersonById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getContactPersonById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContactPerson(@PathVariable Long id) {
        service.deleteContactPerson(id);
        return ResponseEntity.noContent().build();
    }
}