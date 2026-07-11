package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.LoginRequest;
import com.dealership.inventory.dto.response.LoginResponse;

public interface AuthService {
    LoginResponse login(LoginRequest request);
}
