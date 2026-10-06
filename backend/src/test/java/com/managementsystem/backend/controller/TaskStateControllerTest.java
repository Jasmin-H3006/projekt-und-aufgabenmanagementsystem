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
class TaskStateControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long taskStateId;
    private String taskStateName;

    @BeforeEach
    void createTaskState() throws Exception {
        taskStateName = "task-state-" + UUID.randomUUID();

        String body = """
                {
                  "name": "%s",
                  "color": "#ffffff",
                  "fontColorBlack": true,
                  "taskDoneState": false
                }
                """.formatted(taskStateName);
        MvcResult result = mockMvc.perform(post("/api/task-states/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        taskStateId = Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.id").toString());
    }

    @Test
    void updateTaskState() throws Exception {
        String body = """
                {
                  "name": "updated-%s",
                  "color": "#000000",
                  "fontColorBlack": false,
                  "taskDoneState": true
                }
                """.formatted(UUID.randomUUID());
        mockMvc.perform(put("/api/task-states/{taskStateId}", taskStateId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void getAllTaskStates() throws Exception {
        mockMvc.perform(get("/api/task-states/get-all")).andExpect(status().isOk());
    }

    @Test
    void taskStateExists() throws Exception {
        mockMvc.perform(get("/api/task-states/task-state-exists").param("name", taskStateName))
            .andExpect(status().isOk());
    }

    @Test
    void getTaskStateById() throws Exception {
        mockMvc.perform(get("/api/task-states/{taskStateId}", taskStateId)).andExpect(status().isOk());
    }

    @Test
    void deleteTaskState() throws Exception {
        mockMvc.perform(delete("/api/task-states/{taskStateId}", taskStateId)).andExpect(status().isNoContent());
    }
}