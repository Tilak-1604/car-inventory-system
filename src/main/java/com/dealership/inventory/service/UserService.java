package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.UserRegistrationRequest;
import com.dealership.inventory.dto.response.UserResponse;

public interface UserService {
    UserResponse registerUser(UserRegistrationRequest request);
}
