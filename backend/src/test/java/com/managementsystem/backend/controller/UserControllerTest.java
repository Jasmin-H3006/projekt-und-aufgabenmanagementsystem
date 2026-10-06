package com.managementsystem.backend.controller;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.TestInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import com.jayway.jsonpath.JsonPath;
import java.util.UUID;

@SpringBootTest
@AutoConfigureMockMvc
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long userId;
    private String username;

    @BeforeEach
    void createUser() throws Exception {
        username = "user-" + UUID.randomUUID();
        userId = UserControllerTest.createUserMethod(mockMvc, username);
    }

    @Test
    void updateUser() throws Exception {
        String body = """
                {
                  "username": "updated-%s",
                  "password": "newTestPassword123",
                  "status": "ACTIVE",
                  "roleId": 2
                }
                """.formatted(UUID.randomUUID());
        mockMvc.perform(put("/api/users/{userId}", userId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void resetUserPassword() throws Exception {
        mockMvc.perform(put("/api/users/{userId}/reset-password", userId))
            .andExpect(status().isOk());
    }

    @Test
    void getAllUsers() throws Exception {
        mockMvc.perform(get("/api/users/get-all")).andExpect(status().isOk());
    }

    @Test
    void userExists() throws Exception {
        mockMvc.perform(get("/api/users/user-exists").param("username", username))
            .andExpect(status().isOk());
    }

    @Test
    void getUserById() throws Exception {
        mockMvc.perform(get("/api/users/{userId}", userId)).andExpect(status().isOk());
    }

    @Test
    void deleteUser() throws Exception {
        mockMvc.perform(delete("/api/users/{userId}", userId)).andExpect(status().isNoContent());
    }

    // Helper method to create a user and return its ID
    static Long createUserMethod(MockMvc mockMvc, String username) throws Exception {
        String body = """
                {
                  "username": "%s",
                  "password": "testPassword123",
                  "status": "INVITED",
                  "roleId": 1
                }
                """.formatted(username);
        MvcResult result = mockMvc.perform(post("/api/users/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        return Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.userId").toString());
    }
}