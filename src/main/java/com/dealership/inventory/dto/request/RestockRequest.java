package com.dealership.inventory.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record RestockRequest(
    @NotNull(message = "Quantity is required")
    @Min(value = 1, message = "Restock quantity must be greater than zero")
    Integer quantity
) {}
