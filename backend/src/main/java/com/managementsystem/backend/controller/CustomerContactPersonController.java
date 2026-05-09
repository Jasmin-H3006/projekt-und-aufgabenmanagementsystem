package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewCustomerContactPersonDTO;
import com.managementsystem.backend.model.CustomerContactPerson;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.managementsystem.backend.service.CustomerContactPersonService;

@RestController
@RequestMapping("/api/customer/contact-persons")
@RequiredArgsConstructor

public class CustomerContactPersonController {

    private final CustomerContactPersonService service;

    @PostMapping
    public String createCustomerContactPerson(@RequestBody NewCustomerContactPersonDTO dto) {
        service.createCustomerContactPerson(CustomerContactPerson.builder()
            .name(dto.name())
            .email(dto.email())
            .telefone(dto.telefone())
            .jobDescription(dto.jobDescription())
            .build()
        );
        return "Contact person created successfully";
    }
}