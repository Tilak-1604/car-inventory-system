package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;

public interface VehicleService {
    VehicleResponse createVehicle(VehicleRequest request);
    java.util.List<VehicleResponse> getAllVehicles();
    VehicleResponse getVehicleById(Long id);
    VehicleResponse updateVehicle(Long id, VehicleRequest request);
    void deleteVehicle(Long id);
    org.springframework.data.domain.Page<VehicleResponse> searchVehicles(
            com.dealership.inventory.dto.request.VehicleSearchRequest request,
            org.springframework.data.domain.Pageable pageable);
    VehicleResponse purchaseVehicle(Long id, com.dealership.inventory.dto.request.PurchaseRequest request);
    VehicleResponse restockVehicle(Long id, com.dealership.inventory.dto.request.RestockRequest request);
}
