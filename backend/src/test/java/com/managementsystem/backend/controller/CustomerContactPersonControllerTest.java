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
class CustomerContactPersonControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private Long customerId;
    private Long contactPersonId;
    private String contactPersonEmail;

    @BeforeEach
    void createContactPerson() throws Exception {
        // Create a customer (needed for the actual test)
        String customerName = "customer-" + UUID.randomUUID();
        customerId = CustomerControllerTest.createCustomerMethod(mockMvc, customerName);

        // Create customer contact person (the actual test)
        String contactPersonName = "contact-person-" + UUID.randomUUID();
        contactPersonEmail = "mail-" + UUID.randomUUID() + "@test.de";
        contactPersonId = CustomerContactPersonControllerTest.createCustomerContactPersonMethod(mockMvc, contactPersonName, contactPersonEmail, customerId);
    }

    @Test
    void updateContactPerson() throws Exception {
        String contactPersonUpdatedEmail = "mail-" + UUID.randomUUID() + "-updated@test.de";
        String body = """
                {
                  "name": "updated-%s",
                  "email": "%s",
                  "telefone": "0222/2222222",
                  "customerId": %d
                }
                """.formatted(UUID.randomUUID(), contactPersonUpdatedEmail, customerId);
        mockMvc.perform(put("/api/customer/contact-persons/{contactPersonId}", contactPersonId)
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk());
    }

    @Test
    void getAllContactPersons() throws Exception {
        mockMvc.perform(get("/api/customer/contact-persons/get-all")).andExpect(status().isOk());
    }

    @Test
    void contactPersonExists() throws Exception {
        mockMvc.perform(get("/api/customer/contact-persons/contact-person-exists").param("email", contactPersonEmail))
            .andExpect(status().isOk());
    }

    @Test
    void getContactPersonById() throws Exception {
        mockMvc.perform(get("/api/customer/contact-persons/{contactPersonId}", contactPersonId)).andExpect(status().isOk());
    }

    @Test
    void deleteContactPerson() throws Exception {
        mockMvc.perform(delete("/api/customer/contact-persons/{contactPersonId}", contactPersonId)).andExpect(status().isNoContent());
    }

    // Helper method to create a contact person and return its ID
    static Long createCustomerContactPersonMethod(MockMvc mockMvc, String contactPersonName, String contactPersonEmail, Long customerId) throws Exception {
        String body = """
                {
                  "name": "%s",
                  "email": "%s",
                  "telefone": "0111/1111111",
                  "customerId": %d
                }
                """.formatted(contactPersonName, contactPersonEmail, customerId);
        MvcResult result = mockMvc.perform(post("/api/customer/contact-persons/create")
                .contentType(MediaType.APPLICATION_JSON)
                .content(body))
            .andExpect(status().isOk())
            .andReturn();

        return Long.valueOf(JsonPath.read(result.getResponse().getContentAsString(), "$.id").toString());
    }
}