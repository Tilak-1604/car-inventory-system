package com.dealership.inventory.mapper;

import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.entity.Vehicle;
import org.springframework.stereotype.Component;

@Component
public class VehicleMapper {

    public Vehicle toEntity(VehicleRequest request) {
        return new Vehicle(
            request.make(),
            request.model(),
            request.category(),
            request.price(),
            request.quantity()
        );
    }

    public VehicleResponse toResponse(Vehicle vehicle) {
        return new VehicleResponse(
            vehicle.getId(),
            vehicle.getMake(),
            vehicle.getModel(),
            vehicle.getCategory(),
            vehicle.getPrice(),
            vehicle.getQuantity()
        );
    }
}
