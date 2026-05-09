package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewCustomerDTO;
import com.managementsystem.backend.model.Customer;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.managementsystem.backend.service.CustomerService;

@RestController
@RequestMapping("/api/customers")
@RequiredArgsConstructor

public class CustomerController {

    private final CustomerService service;

    @PostMapping
    public String createCustomer(@RequestBody NewCustomerDTO dto) {
        service.createCustomer(Customer.builder()
            .name(dto.name())
            .website(dto.website())
            .build()
        );
        return "Customer created successfully";
    }
}