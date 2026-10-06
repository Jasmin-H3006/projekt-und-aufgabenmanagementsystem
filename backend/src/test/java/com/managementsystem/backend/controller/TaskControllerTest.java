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
class TaskControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long projectId;

    private Long taskId;
    private String taskTitle;

    @BeforeEach
    void createTask() throws Exception {
        // Create a project (needed for the actual test)
        projectId = ProjectControllerTest.createProjectAndEverythingNeededMethod(mockMvc);

        // Create a task (the actual test)
        taskTitle = "task-" + UUID.randomUUID();
        String body = """
                {
                  "title": "%s",
                  "description": "test-description",
                  "projectId": %d,
                  "taskStateId": 1
                }
                """.formatted(taskTitle, projectId);
        MvcResult result = mockMvc.perform(post("/api/tasks/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        taskId = Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.id").toString());
    }

    @Test
    void updateTask() throws Exception {
        String body = """
                {
                  "title": "updated-%s",
                  "description": "updated-test-description",
                  "projectId": %d,
                  "taskStateId": 2
                }
                """.formatted(UUID.randomUUID(), projectId);
        mockMvc.perform(put("/api/tasks/{taskId}", taskId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void getAllTasks() throws Exception {
        mockMvc.perform(get("/api/tasks/get-all")).andExpect(status().isOk());
    }

    @Test
    void getTasksByProjectId() throws Exception {
        mockMvc.perform(get("/api/tasks/projects/{projectId}", projectId)).andExpect(status().isOk());
    }

    @Test
    void taskExistsInProject() throws Exception {
        mockMvc.perform(get("/api/tasks/task-exists-in-project").param("title", taskTitle).param("projectId", projectId.toString()))
            .andExpect(status().isOk());
    }

    @Test
    void deleteTask() throws Exception {
        mockMvc.perform(delete("/api/tasks/{taskId}", taskId)).andExpect(status().isNoContent());
    }
}