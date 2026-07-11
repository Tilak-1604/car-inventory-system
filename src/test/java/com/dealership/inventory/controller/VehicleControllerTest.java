package com.dealership.inventory.controller;

import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.service.VehicleService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import com.dealership.inventory.dto.request.VehicleSearchRequest;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doAnswer;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.Mockito;

@WebMvcTest(VehicleController.class)
@Import(com.dealership.inventory.config.SecurityConfig.class)
class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private VehicleService vehicleService;

    // Security config dependency mocks to allow application context loading in WebMvcTest slice
    @MockBean
    private com.dealership.inventory.security.CustomUserDetailsService customUserDetailsService;

    @MockBean
    private com.dealership.inventory.security.JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private com.dealership.inventory.security.JwtService jwtService;

    @BeforeEach
    void setupMocks() throws Exception {
        // Configure the mocked entry point to write a real 401 so unauthenticated tests pass
        doAnswer(invocation -> {
            HttpServletResponse response = invocation.getArgument(1);
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED, "Unauthorized");
            return null;
        }).when(jwtAuthenticationEntryPoint).commence(
                any(), any(), any());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createVehicle_ShouldReturnCreated_WhenRequestIsValid() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", "Sedan", new BigDecimal("25000.00"), 5);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Corolla", "Sedan", new BigDecimal("25000.00"), 5);

        Mockito.when(vehicleService.createVehicle(any(VehicleRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf()) // CSRF token is required even if disabled in SecurityConfig, MockMvc checks it unless mocked
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.make").value("Toyota"))
                .andExpect(jsonPath("$.model").value("Corolla"))
                .andExpect(jsonPath("$.price").value(25000.00))
                .andExpect(jsonPath("$.quantity").value(5));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createVehicle_ShouldReturnBadRequest_WhenMakeIsBlank() throws Exception {
        VehicleRequest request = new VehicleRequest("", "Corolla", "Sedan", new BigDecimal("25000.00"), 5);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createVehicle_ShouldReturnBadRequest_WhenPriceIsNegative() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", "Sedan", new BigDecimal("-100.00"), 5);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void createVehicle_ShouldReturnBadRequest_WhenQuantityIsNegative() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", "Sedan", new BigDecimal("25000.00"), -1);

        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createVehicle_ShouldReturnUnauthorized_WhenNoJWTProvided() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Corolla", "Sedan", new BigDecimal("25000.00"), 5);

        // No @WithMockUser, so request should be blocked by Spring Security filters
        mockMvc.perform(post("/api/vehicles")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // ─── GET All Vehicles Tests ───────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getAllVehicles_ShouldReturnAllVehicles_WhenAuthenticated() throws Exception {
        java.util.List<VehicleResponse> vehicles = java.util.List.of(
            new VehicleResponse(1L, "Toyota", "Corolla", "Sedan", new BigDecimal("25000.00"), 5),
            new VehicleResponse(2L, "Honda", "Civic", "Sedan", new BigDecimal("26000.00"), 3)
        );

        Mockito.when(vehicleService.getAllVehicles()).thenReturn(vehicles);

        mockMvc.perform(get("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(2))
                .andExpect(jsonPath("$[0].id").value(1L))
                .andExpect(jsonPath("$[0].make").value("Toyota"))
                .andExpect(jsonPath("$[1].id").value(2L))
                .andExpect(jsonPath("$[1].make").value("Honda"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void getAllVehicles_ShouldReturnEmptyList_WhenNoVehiclesExist() throws Exception {
        Mockito.when(vehicleService.getAllVehicles()).thenReturn(java.util.Collections.emptyList());

        mockMvc.perform(get("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void getAllVehicles_ShouldReturnUnauthorized_WhenJWTIsMissing() throws Exception {
        mockMvc.perform(get("/api/vehicles")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized());
    }

    // ─── PUT Update Vehicle Tests ──────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void updateVehicle_ShouldReturnUpdatedVehicle_WhenRequestIsValid() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);

        Mockito.when(vehicleService.updateVehicle(Mockito.eq(1L), any(VehicleRequest.class))).thenReturn(response);

        mockMvc.perform(put("/api/vehicles/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.make").value("Toyota"))
                .andExpect(jsonPath("$.model").value("Camry"))
                .andExpect(jsonPath("$.price").value(28000.00))
                .andExpect(jsonPath("$.quantity").value(3));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void updateVehicle_ShouldReturnNotFound_WhenVehicleDoesNotExist() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);

        Mockito.when(vehicleService.updateVehicle(Mockito.eq(999L), any(VehicleRequest.class)))
                .thenThrow(new com.dealership.inventory.exception.ResourceNotFoundException("Vehicle not found"));

        mockMvc.perform(put("/api/vehicles/999")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void updateVehicle_ShouldReturnBadRequest_WhenPriceIsNegative() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("-50.00"), 3);

        mockMvc.perform(put("/api/vehicles/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void updateVehicle_ShouldReturnUnauthorized_WhenNoJWTProvided() throws Exception {
        VehicleRequest request = new VehicleRequest("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);

        mockMvc.perform(put("/api/vehicles/1")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    // ─── DELETE Vehicle Tests ──────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteVehicle_ShouldReturnNoContent_WhenUserIsAdminAndVehicleExists() throws Exception {
        Mockito.doNothing().when(vehicleService).deleteVehicle(1L);

        mockMvc.perform(delete("/api/vehicles/1")
                        .with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void deleteVehicle_ShouldReturnNotFound_WhenUserIsAdminAndVehicleDoesNotExist() throws Exception {
        Mockito.doThrow(new com.dealership.inventory.exception.ResourceNotFoundException("Vehicle not found with id: 999"))
                .when(vehicleService).deleteVehicle(999L);

        mockMvc.perform(delete("/api/vehicles/999")
                        .with(csrf()))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void deleteVehicle_ShouldReturnForbidden_WhenUserIsRegularUser() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1")
                        .with(csrf()))
                .andExpect(status().isForbidden());
    }

    @Test
    void deleteVehicle_ShouldReturnUnauthorized_WhenNoJWTProvided() throws Exception {
        mockMvc.perform(delete("/api/vehicles/1")
                        .with(csrf()))
                .andExpect(status().isUnauthorized());
    }

    // ─── Search Vehicle Tests ──────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void searchVehicles_ShouldReturnFilteredResults_WhenMakeProvided() throws Exception {
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);
        Page<VehicleResponse> page = new PageImpl<>(List.of(response));

        Mockito.when(vehicleService.searchVehicles(any(VehicleSearchRequest.class), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "Toyota"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].make").value("Toyota"))
                .andExpect(jsonPath("$.content[0].model").value("Camry"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void searchVehicles_ShouldReturnFilteredResults_WhenCategoryProvided() throws Exception {
        VehicleResponse response = new VehicleResponse(2L, "Ford", "Explorer", "SUV", new BigDecimal("35000.00"), 2);
        Page<VehicleResponse> page = new PageImpl<>(List.of(response));

        Mockito.when(vehicleService.searchVehicles(any(VehicleSearchRequest.class), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("category", "SUV"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].category").value("SUV"));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void searchVehicles_ShouldReturnFilteredResults_WhenPriceRangeProvided() throws Exception {
        VehicleResponse response = new VehicleResponse(3L, "Honda", "Civic", "Sedan", new BigDecimal("20000.00"), 5);
        Page<VehicleResponse> page = new PageImpl<>(List.of(response));

        Mockito.when(vehicleService.searchVehicles(any(VehicleSearchRequest.class), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/vehicles/search")
                        .param("minPrice", "15000")
                        .param("maxPrice", "25000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].price").value(20000.00));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void searchVehicles_ShouldReturnAllVehicles_WhenNoFiltersProvided() throws Exception {
        Page<VehicleResponse> page = new PageImpl<>(List.of(
                new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3),
                new VehicleResponse(2L, "Ford", "Explorer", "SUV", new BigDecimal("35000.00"), 2)
        ));

        Mockito.when(vehicleService.searchVehicles(any(VehicleSearchRequest.class), any(Pageable.class)))
                .thenReturn(page);

        mockMvc.perform(get("/api/vehicles/search"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(2));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void searchVehicles_ShouldReturnEmptyList_WhenNoVehiclesMatch() throws Exception {
        Mockito.when(vehicleService.searchVehicles(any(VehicleSearchRequest.class), any(Pageable.class)))
                .thenReturn(Page.empty());

        mockMvc.perform(get("/api/vehicles/search")
                        .param("make", "NonExistentMake"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    void searchVehicles_ShouldReturnUnauthorized_WhenJWTMissing() throws Exception {
        mockMvc.perform(get("/api/vehicles/search"))
                .andExpect(status().isUnauthorized());
    }

    // ─── Purchase Vehicle Tests ───────────────────────────────────────────────

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void purchaseVehicle_ShouldDecreaseQuantity_WhenStockAvailable() throws Exception {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(2);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);

        Mockito.when(vehicleService.purchaseVehicle(eq(1L), any(com.dealership.inventory.dto.request.PurchaseRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/vehicles/1/purchase")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.quantity").value(3));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void purchaseVehicle_ShouldReturnConflict_WhenStockZero() throws Exception {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(1);

        Mockito.when(vehicleService.purchaseVehicle(eq(1L), any(com.dealership.inventory.dto.request.PurchaseRequest.class)))
                .thenThrow(new com.dealership.inventory.exception.OutOfStockException("Not enough stock available"));

        mockMvc.perform(post("/api/vehicles/1/purchase")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isConflict());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void purchaseVehicle_ShouldReturnNotFound_WhenVehicleMissing() throws Exception {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(1);

        Mockito.when(vehicleService.purchaseVehicle(eq(99L), any(com.dealership.inventory.dto.request.PurchaseRequest.class)))
                .thenThrow(new com.dealership.inventory.exception.ResourceNotFoundException("Vehicle not found with id: 99"));

        mockMvc.perform(post("/api/vehicles/99/purchase")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void purchaseVehicle_ShouldReturnUnauthorized_WhenJWTMissing() throws Exception {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(1);

        mockMvc.perform(post("/api/vehicles/1/purchase")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void purchaseVehicle_ShouldReturnBadRequest_WhenQuantityInvalid() throws Exception {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(0);

        mockMvc.perform(post("/api/vehicles/1/purchase")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ─── Restock Vehicle Tests ────────────────────────────────────────────────

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void restockVehicle_ShouldIncreaseQuantity() throws Exception {
        com.dealership.inventory.dto.request.RestockRequest request =
                new com.dealership.inventory.dto.request.RestockRequest(10);
        VehicleResponse response = new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 15);

        Mockito.when(vehicleService.restockVehicle(eq(1L), any(com.dealership.inventory.dto.request.RestockRequest.class)))
                .thenReturn(response);

        mockMvc.perform(post("/api/vehicles/1/restock")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.quantity").value(15));
    }

    @Test
    @WithMockUser(username = "user", roles = {"USER"})
    void restockVehicle_ShouldReturnForbidden_WhenUserRole() throws Exception {
        com.dealership.inventory.dto.request.RestockRequest request =
                new com.dealership.inventory.dto.request.RestockRequest(10);

        mockMvc.perform(post("/api/vehicles/1/restock")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void restockVehicle_ShouldReturnBadRequest_WhenQuantityInvalid() throws Exception {
        com.dealership.inventory.dto.request.RestockRequest request =
                new com.dealership.inventory.dto.request.RestockRequest(0);

        mockMvc.perform(post("/api/vehicles/1/restock")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @WithMockUser(username = "admin", roles = {"ADMIN"})
    void restockVehicle_ShouldReturnNotFound_WhenVehicleMissing() throws Exception {
        com.dealership.inventory.dto.request.RestockRequest request =
                new com.dealership.inventory.dto.request.RestockRequest(5);

        Mockito.when(vehicleService.restockVehicle(eq(99L), any(com.dealership.inventory.dto.request.RestockRequest.class)))
                .thenThrow(new com.dealership.inventory.exception.ResourceNotFoundException("Vehicle not found with id: 99"));

        mockMvc.perform(post("/api/vehicles/99/restock")
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }
}

