package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.PurchaseRequest;
import com.dealership.inventory.dto.request.RestockRequest;
import com.dealership.inventory.dto.request.VehicleRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.entity.Vehicle;
import com.dealership.inventory.exception.OutOfStockException;
import com.dealership.inventory.exception.ResourceNotFoundException;
import com.dealership.inventory.mapper.VehicleMapper;
import com.dealership.inventory.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class VehicleServiceImpl implements VehicleService {

    private final VehicleRepository vehicleRepository;
    private final VehicleMapper vehicleMapper;

    public VehicleServiceImpl(VehicleRepository vehicleRepository, VehicleMapper vehicleMapper) {
        this.vehicleRepository = vehicleRepository;
        this.vehicleMapper = vehicleMapper;
    }

    @Override
    @Transactional
    public VehicleResponse createVehicle(VehicleRequest request) {
        Vehicle vehicle = vehicleMapper.toEntity(request);
        Vehicle savedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(savedVehicle);
    }

    @Override
    @Transactional(readOnly = true)
    public java.util.List<VehicleResponse> getAllVehicles() {
        return vehicleRepository.findAll().stream()
                .map(vehicleMapper::toResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public VehicleResponse getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));
        return vehicleMapper.toResponse(vehicle);
    }

    @Override
    @Transactional
    public VehicleResponse updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new com.dealership.inventory.exception.ResourceNotFoundException(
                        "Vehicle not found with id: " + id));

        vehicle.setMake(request.make());
        vehicle.setModel(request.model());
        vehicle.setCategory(request.category());
        vehicle.setPrice(request.price());
        vehicle.setQuantity(request.quantity());

        Vehicle updatedVehicle = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(updatedVehicle);
    }

    @Override
    @Transactional
    public void deleteVehicle(Long id) {
        if (!vehicleRepository.existsById(id)) {
            throw new com.dealership.inventory.exception.ResourceNotFoundException(
                    "Vehicle not found with id: " + id);
        }
        vehicleRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<VehicleResponse> searchVehicles(
            com.dealership.inventory.dto.request.VehicleSearchRequest request,
            org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.jpa.domain.Specification<Vehicle> spec =
                com.dealership.inventory.repository.VehicleSpecification.filterBy(request);
        org.springframework.data.domain.Page<Vehicle> vehiclePage = vehicleRepository.findAll(spec, pageable);
        return vehiclePage.map(vehicleMapper::toResponse);
    }

    @Override
    @Transactional
    public VehicleResponse purchaseVehicle(Long id, PurchaseRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        if (vehicle.getQuantity() <= 0) {
            throw new OutOfStockException("Vehicle '" + vehicle.getMake() + " " + vehicle.getModel() + "' is out of stock");
        }
        if (request.quantity() > vehicle.getQuantity()) {
            throw new OutOfStockException("Requested quantity " + request.quantity()
                    + " exceeds available stock of " + vehicle.getQuantity());
        }

        vehicle.setQuantity(vehicle.getQuantity() - request.quantity());
        Vehicle updated = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public VehicleResponse restockVehicle(Long id, RestockRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Vehicle not found with id: " + id));

        vehicle.setQuantity(vehicle.getQuantity() + request.quantity());
        Vehicle updated = vehicleRepository.save(vehicle);
        return vehicleMapper.toResponse(updated);
    }
}
