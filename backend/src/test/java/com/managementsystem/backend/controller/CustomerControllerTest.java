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
class CustomerControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long customerId;
    private String customerName;

    @BeforeEach
    void createCustomer() throws Exception {
        customerName = "customer-" + UUID.randomUUID();
        customerId = CustomerControllerTest.createCustomerMethod(mockMvc, customerName);
    }

    @Test
    void updateCustomer() throws Exception {
        String body = """
                {
                  "name": "updated-%s",
                  "website": "www.updated.de"
                }
                """.formatted(UUID.randomUUID());
        mockMvc.perform(put("/api/customers/{customerId}", customerId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void getAllCustomers() throws Exception {
        mockMvc.perform(get("/api/customers/get-all")).andExpect(status().isOk());
    }

    @Test
    void customerExists() throws Exception {
        mockMvc.perform(get("/api/customers/customer-exists").param("name", customerName))
            .andExpect(status().isOk());
    }

    @Test
    void getCustomerById() throws Exception {
        mockMvc.perform(get("/api/customers/{customerId}", customerId)).andExpect(status().isOk());
    }

    @Test
    void deleteCustomer() throws Exception {
        mockMvc.perform(delete("/api/customers/{customerId}", customerId)).andExpect(status().isNoContent());
    }

    // Helper method to create a customer and return its ID
    static Long createCustomerMethod(MockMvc mockMvc, String customerName) throws Exception {
        String body = """
                {
                    "name": "%s",
                    "website": "www.test.de"
                }
                """.formatted(customerName);
        MvcResult result = mockMvc.perform(post("/api/customers/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        return Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.id").toString());
    }
}