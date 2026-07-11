package com.dealership.inventory.config;

import com.dealership.inventory.entity.Role;
import com.dealership.inventory.entity.User;
import com.dealership.inventory.entity.Vehicle;
import com.dealership.inventory.repository.UserRepository;
import com.dealership.inventory.repository.VehicleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

/**
 * DataInitializer — seeds default users (admin, user) and initial catalog vehicles
 * into the database on startup if they do not already exist.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UserRepository userRepository,
                           VehicleRepository vehicleRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.vehicleRepository = vehicleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        // 1. Seed Admin User if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User(
                "admin",
                "admin@dealership.com",
                passwordEncoder.encode("adminpassword"),
                Role.ADMIN
            );
            userRepository.save(admin);
            System.out.println("Seeded Default ADMIN: username='admin', password='adminpassword'");
        }

        // 2. Seed Regular User if not exists
        if (!userRepository.existsByUsername("user")) {
            User user = new User(
                "user",
                "user@dealership.com",
                passwordEncoder.encode("userpassword"),
                Role.USER
            );
            userRepository.save(user);
            System.out.println("Seeded Default USER: username='user', password='userpassword'");
        }

        // 3. Seed Vehicles
        if (vehicleRepository.count() == 0) {
            List<Vehicle> initialVehicles = List.of(
                new Vehicle("Toyota", "Camry", "Sedan", new BigDecimal("28000.00"), 5),
                new Vehicle("Ford", "Mustang", "Coupe", new BigDecimal("45000.00"), 3),
                new Vehicle("Honda", "CR-V", "SUV", new BigDecimal("32000.00"), 8),
                new Vehicle("Tesla", "Model 3", "Sedan", new BigDecimal("40000.00"), 0), // Out of Stock!
                new Vehicle("Ford", "F-150", "Truck", new BigDecimal("52000.00"), 4),
                new Vehicle("Chevrolet", "Tahoe", "SUV", new BigDecimal("65000.00"), 2),
                new Vehicle("Honda", "Civic", "Sedan", new BigDecimal("24000.00"), 10)
            );
            vehicleRepository.saveAll(initialVehicles);
            System.out.println("Seeded initial vehicle inventory (" + initialVehicles.size() + " items).");
        }
    }
}
