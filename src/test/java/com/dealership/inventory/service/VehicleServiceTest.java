package com.dealership.inventory.service;

import com.dealership.inventory.dto.request.VehicleSearchRequest;
import com.dealership.inventory.dto.response.VehicleResponse;
import com.dealership.inventory.entity.Vehicle;
import com.dealership.inventory.mapper.VehicleMapper;
import com.dealership.inventory.repository.VehicleRepository;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Path;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;

import java.math.BigDecimal;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VehicleServiceTest {

    @Mock
    private VehicleRepository vehicleRepository;

    @Mock
    private VehicleMapper vehicleMapper;

    @InjectMocks
    private VehicleServiceImpl vehicleService;

    private Root<Vehicle> root;
    private CriteriaQuery<?> query;
    private CriteriaBuilder cb;
    private Path<String> stringPath;
    private Path<BigDecimal> decimalPath;

    @SuppressWarnings("unchecked")
    @BeforeEach
    void setUp() {
        root = mock(Root.class);
        query = mock(CriteriaQuery.class);
        cb = mock(CriteriaBuilder.class);
        stringPath = mock(Path.class);
        decimalPath = mock(Path.class);

        Predicate mockAndPredicate = mock(Predicate.class);
        lenient().when(cb.and(any(Predicate[].class))).thenReturn(mockAndPredicate);
    }

    @Test
    void shouldBuildSpecificationUsingMake() {
        VehicleSearchRequest request = new VehicleSearchRequest("Toyota", null, null, null, null);
        Pageable pageable = PageRequest.of(0, 10);
        
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);
        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));

        when(vehicleRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(vehiclePage);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3));

        Page<VehicleResponse> result = vehicleService.searchVehicles(request, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());

        // Capture specification and verify criteria building
        ArgumentCaptor<Specification<Vehicle>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(vehicleRepository).findAll(specCaptor.capture(), eq(pageable));

        Specification<Vehicle> capturedSpec = specCaptor.getValue();
        assertNotNull(capturedSpec);

        // Verify Predicate behavior
        when(root.<String>get("make")).thenReturn(stringPath);
        when(cb.lower(stringPath)).thenReturn(stringPath);
        Predicate likePredicate = mock(Predicate.class);
        when(cb.like(stringPath, "%toyota%")).thenReturn(likePredicate);

        Predicate resultPredicate = capturedSpec.toPredicate(root, query, cb);
        assertNotNull(resultPredicate);
        verify(cb).like(stringPath, "%toyota%");
    }

    @Test
    void shouldBuildSpecificationUsingCategory() {
        VehicleSearchRequest request = new VehicleSearchRequest(null, null, "SUV", null, null);
        Pageable pageable = PageRequest.of(0, 10);
        
        Vehicle vehicle = new Vehicle("Ford", "Explorer", "SUV", new BigDecimal("35000.00"), 2);
        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));

        when(vehicleRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(vehiclePage);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(new VehicleResponse(2L, "Ford", "Explorer", "SUV", new BigDecimal("35000.00"), 2));

        Page<VehicleResponse> result = vehicleService.searchVehicles(request, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());

        ArgumentCaptor<Specification<Vehicle>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(vehicleRepository).findAll(specCaptor.capture(), eq(pageable));

        Specification<Vehicle> capturedSpec = specCaptor.getValue();
        assertNotNull(capturedSpec);

        when(root.<String>get("category")).thenReturn(stringPath);
        Predicate equalPredicate = mock(Predicate.class);
        when(cb.equal(stringPath, "SUV")).thenReturn(equalPredicate);

        Predicate resultPredicate = capturedSpec.toPredicate(root, query, cb);
        assertNotNull(resultPredicate);
        verify(cb).equal(stringPath, "SUV");
    }

    @Test
    void shouldBuildSpecificationUsingPriceRange() {
        VehicleSearchRequest request = new VehicleSearchRequest(null, null, null, new BigDecimal("15000"), new BigDecimal("25000"));
        Pageable pageable = PageRequest.of(0, 10);
        
        Vehicle vehicle = new Vehicle("Honda", "Civic", "Sedan", new BigDecimal("20000.00"), 5);
        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));

        when(vehicleRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(vehiclePage);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(new VehicleResponse(3L, "Honda", "Civic", "Sedan", new BigDecimal("20000.00"), 5));

        Page<VehicleResponse> result = vehicleService.searchVehicles(request, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());

        ArgumentCaptor<Specification<Vehicle>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(vehicleRepository).findAll(specCaptor.capture(), eq(pageable));

        Specification<Vehicle> capturedSpec = specCaptor.getValue();
        assertNotNull(capturedSpec);

        when(root.<BigDecimal>get("price")).thenReturn(decimalPath);
        Predicate greaterThanPredicate = mock(Predicate.class);
        Predicate lessThanPredicate = mock(Predicate.class);
        when(cb.greaterThanOrEqualTo(decimalPath, new BigDecimal("15000"))).thenReturn(greaterThanPredicate);
        when(cb.lessThanOrEqualTo(decimalPath, new BigDecimal("25000"))).thenReturn(lessThanPredicate);

        Predicate resultPredicate = capturedSpec.toPredicate(root, query, cb);
        assertNotNull(resultPredicate);
        verify(cb).greaterThanOrEqualTo(decimalPath, new BigDecimal("15000"));
        verify(cb).lessThanOrEqualTo(decimalPath, new BigDecimal("25000"));
    }

    @Test
    void shouldCombineMultipleFilters() {
        VehicleSearchRequest request = new VehicleSearchRequest("Toyota", "Camry", "Sedan", new BigDecimal("20000"), new BigDecimal("30000"));
        Pageable pageable = PageRequest.of(0, 10);
        
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);
        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(vehicle));

        when(vehicleRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(vehiclePage);
        when(vehicleMapper.toResponse(vehicle)).thenReturn(new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3));

        Page<VehicleResponse> result = vehicleService.searchVehicles(request, pageable);

        assertNotNull(result);

        ArgumentCaptor<Specification<Vehicle>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(vehicleRepository).findAll(specCaptor.capture(), eq(pageable));

        Specification<Vehicle> capturedSpec = specCaptor.getValue();
        assertNotNull(capturedSpec);

        // We mock paths and predicate creations
        when(root.<String>get("make")).thenReturn(stringPath);
        when(root.<String>get("model")).thenReturn(stringPath);
        when(root.<String>get("category")).thenReturn(stringPath);
        when(root.<BigDecimal>get("price")).thenReturn(decimalPath);

        when(cb.lower(any())).thenReturn(stringPath);
        
        Predicate dummyPredicate = mock(Predicate.class);
        when(cb.like(any(), anyString())).thenReturn(dummyPredicate);
        when(cb.equal(any(), anyString())).thenReturn(dummyPredicate);
        when(cb.greaterThanOrEqualTo(any(), any(BigDecimal.class))).thenReturn(dummyPredicate);
        when(cb.lessThanOrEqualTo(any(), any(BigDecimal.class))).thenReturn(dummyPredicate);

        Predicate resultPredicate = capturedSpec.toPredicate(root, query, cb);
        assertNotNull(resultPredicate);
        
        verify(cb).like(stringPath, "%toyota%");
        verify(cb).like(stringPath, "%camry%");
        verify(cb).equal(stringPath, "Sedan");
        verify(cb).greaterThanOrEqualTo(decimalPath, new BigDecimal("20000"));
        verify(cb).lessThanOrEqualTo(decimalPath, new BigDecimal("30000"));
    }

    @Test
    void shouldReturnAllVehiclesWhenFiltersEmpty() {
        VehicleSearchRequest request = new VehicleSearchRequest(null, null, null, null, null);
        Pageable pageable = PageRequest.of(0, 10);
        
        Page<Vehicle> vehiclePage = new PageImpl<>(List.of(
                new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3)
        ));

        when(vehicleRepository.findAll(any(Specification.class), any(Pageable.class))).thenReturn(vehiclePage);
        when(vehicleMapper.toResponse(any())).thenReturn(new VehicleResponse(1L, "Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3));

        Page<VehicleResponse> result = vehicleService.searchVehicles(request, pageable);

        assertNotNull(result);
        assertEquals(1, result.getContent().size());

        ArgumentCaptor<Specification<Vehicle>> specCaptor = ArgumentCaptor.forClass(Specification.class);
        verify(vehicleRepository).findAll(specCaptor.capture(), eq(pageable));

        Specification<Vehicle> capturedSpec = specCaptor.getValue();
        assertNotNull(capturedSpec);

        Predicate resultPredicate = capturedSpec.toPredicate(root, query, cb);
        // Since no restrictions are added, it should be null or empty conjunction/predicate list
        assertTrue(resultPredicate == null || resultPredicate.getExpressions().isEmpty());
    }

    // ─── Phase 5: Inventory Management (Purchase & Restock) ──────────────────

    @Test
    void purchase_ShouldDecreaseInventory() {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(2);
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 5);
        vehicle.setId(1L);

        when(vehicleRepository.findById(1L)).thenReturn(java.util.Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(inv -> inv.getArgument(0));
        when(vehicleMapper.toResponse(any(Vehicle.class)))
                .thenAnswer(inv -> {
                    Vehicle v = inv.getArgument(0);
                    return new com.dealership.inventory.dto.response.VehicleResponse(
                            v.getId(), v.getMake(), v.getModel(), v.getCategory(), v.getPrice(), v.getQuantity());
                });

        com.dealership.inventory.dto.response.VehicleResponse result =
                vehicleService.purchaseVehicle(1L, request);

        assertEquals(3, result.quantity());  // 5 - 2 = 3
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void purchase_ShouldThrowException_WhenOutOfStock() {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(1);
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 0);
        vehicle.setId(1L);

        when(vehicleRepository.findById(1L)).thenReturn(java.util.Optional.of(vehicle));

        assertThrows(com.dealership.inventory.exception.OutOfStockException.class,
                () -> vehicleService.purchaseVehicle(1L, request));
    }

    @Test
    void purchase_ShouldThrowException_WhenVehicleMissing() {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(1);

        when(vehicleRepository.findById(99L)).thenReturn(java.util.Optional.empty());

        assertThrows(com.dealership.inventory.exception.ResourceNotFoundException.class,
                () -> vehicleService.purchaseVehicle(99L, request));
    }

    @Test
    void purchase_ShouldThrowException_WhenRequestedQuantityGreaterThanStock() {
        com.dealership.inventory.dto.request.PurchaseRequest request =
                new com.dealership.inventory.dto.request.PurchaseRequest(10);
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 3);
        vehicle.setId(1L);

        when(vehicleRepository.findById(1L)).thenReturn(java.util.Optional.of(vehicle));

        assertThrows(com.dealership.inventory.exception.OutOfStockException.class,
                () -> vehicleService.purchaseVehicle(1L, request));
    }

    @Test
    void restock_ShouldIncreaseInventory() {
        com.dealership.inventory.dto.request.RestockRequest request =
                new com.dealership.inventory.dto.request.RestockRequest(10);
        Vehicle vehicle = new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 5);
        vehicle.setId(1L);

        when(vehicleRepository.findById(1L)).thenReturn(java.util.Optional.of(vehicle));
        when(vehicleRepository.save(any(Vehicle.class))).thenAnswer(inv -> inv.getArgument(0));
        when(vehicleMapper.toResponse(any(Vehicle.class)))
                .thenAnswer(inv -> {
                    Vehicle v = inv.getArgument(0);
                    return new com.dealership.inventory.dto.response.VehicleResponse(
                            v.getId(), v.getMake(), v.getModel(), v.getCategory(), v.getPrice(), v.getQuantity());
                });

        com.dealership.inventory.dto.response.VehicleResponse result =
                vehicleService.restockVehicle(1L, request);

        assertEquals(15, result.quantity());  // 5 + 10 = 15
        verify(vehicleRepository).save(vehicle);
    }

    @Test
    void restock_ShouldThrowException_WhenVehicleMissing() {
        com.dealership.inventory.dto.request.RestockRequest request =
                new com.dealership.inventory.dto.request.RestockRequest(5);

        when(vehicleRepository.findById(99L)).thenReturn(java.util.Optional.empty());

        assertThrows(com.dealership.inventory.exception.ResourceNotFoundException.class,
                () -> vehicleService.restockVehicle(99L, request));
    }
}

