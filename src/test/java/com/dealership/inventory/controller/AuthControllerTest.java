package com.dealership.inventory.controller;

import com.dealership.inventory.dto.request.LoginRequest;
import com.dealership.inventory.dto.request.UserRegistrationRequest;
import com.dealership.inventory.dto.response.LoginResponse;
import com.dealership.inventory.dto.response.UserResponse;
import com.dealership.inventory.entity.Role;
import com.dealership.inventory.service.AuthService;
import com.dealership.inventory.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private AuthService authService;

    @MockBean
    private com.dealership.inventory.security.CustomUserDetailsService customUserDetailsService;

    @MockBean
    private com.dealership.inventory.security.JwtAuthenticationFilter jwtAuthenticationFilter;

    @MockBean
    private com.dealership.inventory.security.JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @MockBean
    private com.dealership.inventory.security.JwtService jwtService;

    // ─── Registration Tests ────────────────────────────────────────────────────

    @Test
    void register_ShouldReturnCreated_WhenPayloadIsValid() throws Exception {
        UserRegistrationRequest request = new UserRegistrationRequest(
                "tilak_dev", "tilak@example.com", "SecurePassword123");
        UserResponse response = new UserResponse(1L, "tilak_dev", "tilak@example.com", Role.USER);

        Mockito.when(userService.registerUser(any(UserRegistrationRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.username").value("tilak_dev"))
                .andExpect(jsonPath("$.email").value("tilak@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void register_ShouldReturnBadRequest_WhenUsernameIsTooShort() throws Exception {
        UserRegistrationRequest request = new UserRegistrationRequest(
                "ti", "tilak@example.com", "SecurePassword123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    // ─── Login Tests ───────────────────────────────────────────────────────────

    @Test
    void login_ShouldReturnToken_WhenCredentialsAreValid() throws Exception {
        LoginRequest request = new LoginRequest("tilak_dev", "SecurePassword123");
        LoginResponse response = new LoginResponse(
                "eyJhbGciOiJIUzI1NiJ9.mocktoken", "Bearer", "tilak_dev", "USER");

        Mockito.when(authService.login(any(LoginRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.type").value("Bearer"))
                .andExpect(jsonPath("$.username").value("tilak_dev"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenPasswordIsIncorrect() throws Exception {
        LoginRequest request = new LoginRequest("tilak_dev", "WrongPassword");

        Mockito.when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("Invalid credentials"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_ShouldReturnUnauthorized_WhenUserDoesNotExist() throws Exception {
        LoginRequest request = new LoginRequest("ghost_user", "AnyPassword");

        Mockito.when(authService.login(any(LoginRequest.class)))
                .thenThrow(new BadCredentialsException("User not found"));

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void login_ShouldReturnBadRequest_WhenUsernameIsBlank() throws Exception {
        LoginRequest request = new LoginRequest("", "SecurePassword123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}
