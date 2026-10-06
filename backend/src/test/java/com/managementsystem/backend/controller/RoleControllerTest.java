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
class RoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long roleId;
    private String roleName;

    @BeforeEach
    void createRole() throws Exception {
        roleName = "role-" + UUID.randomUUID();

        String body = """
                {
                  "name": "%s",
                  "adminAccess": false,
                  "allProjectsAccess": false,
                  "createProjectsAccess": true,
                  "editAvailableProjectsAccess": true,
                  "createAndEditTasksAccess": true,
                  "customerPageAccess": true
                }
                """.formatted(roleName);
        MvcResult result = mockMvc.perform(post("/api/roles/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        roleId = Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.id").toString());
    }

    @Test
    void updateRole() throws Exception {
        String body = """
                {
                  "name": "updated-%s",
                  "adminAccess": false,
                  "allProjectsAccess": true,
                  "createProjectsAccess": true,
                  "editAvailableProjectsAccess": true,
                  "createAndEditTasksAccess": true,
                  "customerPageAccess": false
                }
                """.formatted(UUID.randomUUID());
        mockMvc.perform(put("/api/roles/{roleId}", roleId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void getAllRoles() throws Exception {
        mockMvc.perform(get("/api/roles/get-all")).andExpect(status().isOk());
    }

    @Test
    void roleExists() throws Exception {
        mockMvc.perform(get("/api/roles/role-exists").param("name", roleName))
            .andExpect(status().isOk());
    }

    @Test
    void getRoleById() throws Exception {
        mockMvc.perform(get("/api/roles/{roleId}", roleId)).andExpect(status().isOk());
    }

    @Test
    void deleteRole() throws Exception {
        mockMvc.perform(delete("/api/roles/{roleId}", roleId)).andExpect(status().isNoContent());
    }
}