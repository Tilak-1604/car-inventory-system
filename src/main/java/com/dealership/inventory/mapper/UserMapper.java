package com.dealership.inventory.mapper;

import com.dealership.inventory.dto.request.UserRegistrationRequest;
import com.dealership.inventory.dto.response.UserResponse;
import com.dealership.inventory.entity.Role;
import com.dealership.inventory.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toEntity(UserRegistrationRequest request, String encodedPassword) {
        return new User(
            request.username(),
            request.email(),
            encodedPassword,
            Role.USER
        );
    }

    public UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getUsername(),
            user.getEmail(),
            user.getRole()
        );
    }
}
