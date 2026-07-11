package com.dealership.inventory.dto.response;

public record LoginResponse(
    String token,
    String type,
    String username,
    String role
) {}
