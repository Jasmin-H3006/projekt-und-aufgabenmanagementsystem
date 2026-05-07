package com.managementsystem.backend.controller;

import com.managementsystem.backend.dto.Dtos.NewUserDTO;
import com.managementsystem.backend.model.User;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import com.managementsystem.backend.service.UserService;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {

    private final UserService service;

    @PostMapping
    public String createUser(@RequestBody NewUserDTO dto) {


        service.createUser(User.builder()
            .username(dto.username())
            .password(dto.password())
            .role(dto.role())
            .build()

        );

        return "User created successfully";
    }
}