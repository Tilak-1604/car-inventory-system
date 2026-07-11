package com.dealership.inventory.dto.response;

import com.dealership.inventory.entity.Role;

public record UserResponse(
    Long id,
    String username,
    String email,
    Role role
) {}
