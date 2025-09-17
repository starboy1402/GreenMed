// File: PlantManagementSystem-backend/backend/src/main/java/com/plantmanagement/service/AuthService.java
package com.plantmanagement.service;

import com.plantmanagement.dto.LoginRequest;
import com.plantmanagement.dto.LoginResponse;
import com.plantmanagement.dto.SignupRequest;
import com.plantmanagement.dto.UserResponse;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.UserRepository;
import com.plantmanagement.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final Set<String> blacklistedTokens = new HashSet<>();

    public UserResponse signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User.UserRole role;
        try {
            // Renamed to userType to match the entity
            role = User.UserRole.valueOf(request.getUserType().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role. Must be CUSTOMER or SELLER");
        }

        // --- Start of Changes ---

        // Validation for phone number and address for ALL users
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            throw new RuntimeException("Phone number is required");
        }
        if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
            throw new RuntimeException("Address is required");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUserType(role);
        user.setIsActive(true);

        // Set phone number and address for all users
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());

        if (role == User.UserRole.SELLER) {
            if (request.getShopName() == null || request.getShopName().trim().isEmpty()) {
                throw new RuntimeException("Shop name is required for sellers");
            }
            user.setShopName(request.getShopName());
            user.setApplicationStatus(User.ApplicationStatus.PENDING);
        } else {
            user.setApplicationStatus(User.ApplicationStatus.APPROVED);
        }

        // --- End of Changes ---

        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        return new UserResponse(savedUser);
    }

    // ... (the rest of the AuthService remains the same, but ensure UserResponse is
    // updated)

    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("User not found for email: {}", request.getEmail());
                    return new RuntimeException("Invalid email or password");
                });

        log.info("User found: {}, Role: {}, Active: {}, ApplicationStatus: {}",
                user.getEmail(), user.getUserType(), user.getIsActive(), user.getApplicationStatus());

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Password mismatch for email: {}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }

        if (!user.getIsActive()) {
            log.error("User account is inactive: {}", request.getEmail());
            throw new RuntimeException("Account is deactivated. Please contact support.");
        }

        if (user.getUserType() == User.UserRole.SELLER &&
                user.getApplicationStatus() != User.ApplicationStatus.APPROVED) {
            String message = switch (user.getApplicationStatus()) {
                case PENDING -> "Your seller application is still pending approval.";
                case REJECTED -> "Your seller application was rejected. Please contact support.";
                default -> "Your account is not approved for selling.";
            };
            log.error("Seller not approved: {}", request.getEmail());
            throw new RuntimeException(message);
        }

        try {
            String token = jwtUtil.generateToken(user.getEmail(), user.getId().toString(), user.getUserType().name());
            UserResponse userResponse = new UserResponse(user);
            log.info("Login successful for email: {}", request.getEmail());
            return new LoginResponse(token, userResponse);
        } catch (Exception e) {
            log.error("Error generating token for user: {}", request.getEmail(), e);
            throw new RuntimeException("Failed to generate authentication token");
        }
    }

    public void logout(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        blacklistedTokens.add(token);
        log.info("Token blacklisted successfully");
    }

    public UserResponse getCurrentUser(String token) {
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        if (blacklistedTokens.contains(token)) {
            throw new RuntimeException("Token is no longer valid");
        }
        if (!jwtUtil.isTokenValid(token)) {
            throw new RuntimeException("Invalid or expired token");
        }
        String email = jwtUtil.extractEmail(token);
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return new UserResponse(user);
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.contains(token);
    }
}