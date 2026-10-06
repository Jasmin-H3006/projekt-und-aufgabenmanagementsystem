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
class ProjectControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long customerId;
    private Long contactPersonId;
    private Long userId;
    private Long projectManagerId;

    private Long projectId;
    private String projectTitle;

    @BeforeEach
    void createProject() throws Exception {
        // Create a customer (needed for the actual test)
        String customerName = "customer-" + UUID.randomUUID();
        customerId = CustomerControllerTest.createCustomerMethod(mockMvc, customerName);

        // Create customer contact person (needed for the actual test)
        String contactPersonName = "contact-person-" + UUID.randomUUID();
        String contactPersonEmail = "mail-" + UUID.randomUUID() + "@test.de";
        contactPersonId = CustomerContactPersonControllerTest.createCustomerContactPersonMethod(mockMvc, contactPersonName, contactPersonEmail, customerId);

        // Create a user + project manager (second user) (needed for the actual test)
        String username = "user-" + UUID.randomUUID();
        userId = UserControllerTest.createUserMethod(mockMvc, username);
        String projectManagerUsername = "project-manager-" + UUID.randomUUID();
        projectManagerId = UserControllerTest.createUserMethod(mockMvc, projectManagerUsername);

        // Create a project (the actual test)
        projectTitle = "project-" + UUID.randomUUID();
        projectId = ProjectControllerTest.createProjectMethod(mockMvc, projectTitle, customerId, projectManagerId, userId, contactPersonId);
    }

    @Test
    void updateProject() throws Exception {
        String body = """
                {
                  "title": "updated-%s",
                  "deadline": "2029-12-31",
                  "description": "test-description-updated",
                  "archived": true,
                  "customerId": %d,
                  "projectManagerId": %d,
                  "userIds": [%d],
                  "contactPersonIds": [%d]
                }
                """.formatted(UUID.randomUUID(), customerId, projectManagerId, userId, contactPersonId);
        mockMvc.perform(put("/api/projects/{projectId}", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void updateProjectArchivedState() throws Exception {
        String body = """
                {
                  "archived": true
                }
                """;
        mockMvc.perform(put("/api/projects/{projectId}/update-archived-state", projectId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void getAllProjects() throws Exception {
        mockMvc.perform(get("/api/projects/get-all")).andExpect(status().isOk());
    }

    @Test 
    void getMyProjects() throws Exception {
        mockMvc.perform(get("/api/projects/get-my-projects").param("userId", "1")).andExpect(status().isOk());
    }

    @Test 
    void getOtherProjects() throws Exception {
        mockMvc.perform(get("/api/projects/get-other-projects").param("userId", "1")).andExpect(status().isOk());
    }

    @Test
    void projectExists() throws Exception {
        mockMvc.perform(get("/api/projects/project-exists").param("title", projectTitle).param("deadline", "2028-12-31").param("customerId", customerId.toString())).andExpect(status().isOk());
    }

    @Test
    void deleteProject() throws Exception {
        mockMvc.perform(delete("/api/projects/{projectId}", projectId)).andExpect(status().isNoContent());
    }

    // Helper method to create a project and return its ID
    static Long createProjectMethod(MockMvc mockMvc, String projectTitle, Long customerId, Long projectManagerId, Long userId, Long contactPersonId) throws Exception {
        String body = """
                {
                  "title": "%s",
                  "deadline": "2028-12-31",
                  "description": "test-description",
                  "archived": false,
                  "customerId": %d,
                  "projectManagerId": %d,
                  "userIds": [%d],
                  "contactPersonIds": [%d]
                }
                """.formatted(projectTitle, customerId, projectManagerId, userId, contactPersonId);
        MvcResult result = mockMvc.perform(post("/api/projects/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        return Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.id").toString());
    }

    // Helper method to create a project and everything needed and return its ID (needed for other tests, which require an existing project)
    static Long createProjectAndEverythingNeededMethod(MockMvc mockMvc) throws Exception {
        // Create a customer
        String customerName = "customer-" + UUID.randomUUID();
        Long customerId = CustomerControllerTest.createCustomerMethod(mockMvc, customerName);

        // Create customer contact person
        String contactPersonName = "contact-person-" + UUID.randomUUID();
        String contactPersonEmail = "mail-" + UUID.randomUUID() + "@test.de";
        Long contactPersonId = CustomerContactPersonControllerTest.createCustomerContactPersonMethod(mockMvc, contactPersonName, contactPersonEmail, customerId);

        // Create a user + project manager (second user)
        String username = "user-" + UUID.randomUUID();
        Long userId = UserControllerTest.createUserMethod(mockMvc, username);
        String projectManagerUsername = "project-manager-" + UUID.randomUUID();
        Long projectManagerId = UserControllerTest.createUserMethod(mockMvc, projectManagerUsername);

        // Create a project
        String projectTitle = "project-" + UUID.randomUUID();
        // Return project id
        return ProjectControllerTest.createProjectMethod(mockMvc, projectTitle, customerId, projectManagerId, userId, contactPersonId);
    }
}