package com.dealership.inventory.repository;

import com.dealership.inventory.dto.request.VehicleSearchRequest;
import com.dealership.inventory.entity.Vehicle;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class VehicleSpecification {

    public static Specification<Vehicle> filterBy(VehicleSearchRequest request) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.make() != null && !request.make().isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("make")),
                        "%" + request.make().toLowerCase() + "%"
                ));
            }

            if (request.model() != null && !request.model().isBlank()) {
                predicates.add(cb.like(
                        cb.lower(root.get("model")),
                        "%" + request.model().toLowerCase() + "%"
                ));
            }

            if (request.category() != null && !request.category().isBlank()) {
                predicates.add(cb.equal(root.get("category"), request.category()));
            }

            if (request.minPrice() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("price"), request.minPrice()));
            }

            if (request.maxPrice() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("price"), request.maxPrice()));
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
