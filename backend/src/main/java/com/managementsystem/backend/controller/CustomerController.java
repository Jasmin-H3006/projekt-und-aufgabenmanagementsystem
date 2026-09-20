package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewCustomerDTO;
import com.managementsystem.backend.model.Customer;
import com.managementsystem.backend.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.http.ResponseEntity;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor

public class CustomerController {

    private final CustomerService service;

    @PostMapping("/create")
    public String createCustomer(@RequestBody NewCustomerDTO dto) {
        service.createCustomer(Customer.builder()
            .name(dto.name())
            .website(dto.website())
            .build()
        );
        return "Customer created successfully";
    }

    @PutMapping("/{id}")
    public ResponseEntity<Customer> updateCustomer(@PathVariable Long id, @RequestBody NewCustomerDTO dto) {
        Customer existing = service.getCustomerById(id);

        // Check if name is being changed and if the new name already exists
        if (!existing.getName().equals(dto.name()) && service.customerExists(dto.name())) {
            return ResponseEntity.status(409).build();
        }

        existing.setName(dto.name());
        existing.setWebsite(dto.website());

        return ResponseEntity.ok(service.createCustomer(existing));
    }

    @GetMapping("/get-all")
    public List<Customer> getAllCustomers() {
        return service.getAllCustomers();
    }

    @GetMapping("/customer-exists")
    public ResponseEntity<Boolean> customerExists(@RequestParam String name) {
        return ResponseEntity.ok(service.customerExists(name));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Customer> getCustomerById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getCustomerById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        service.deleteCustomer(id);
        return ResponseEntity.noContent().build();
    }
}