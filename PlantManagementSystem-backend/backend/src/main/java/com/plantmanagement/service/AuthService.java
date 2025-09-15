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

import java.time.LocalDateTime;
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
        // Check if user already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        // Validate role
        User.UserRole role;
        try {
            role = User.UserRole.valueOf(request.getRole().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid role. Must be CUSTOMER or SELLER");
        }
        
        // Create new user
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setIsActive(true);
        
        // Set seller-specific fields
        if (role == User.UserRole.SELLER) {
            if (request.getBusinessName() == null || request.getBusinessName().trim().isEmpty()) {
                throw new RuntimeException("Business name is required for sellers");
            }
            if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
                throw new RuntimeException("Phone number is required for sellers");
            }
            
            user.setBusinessName(request.getBusinessName());
            user.setPhoneNumber(request.getPhoneNumber());
            user.setAddress(request.getAddress());
            user.setApplicationStatus(User.ApplicationStatus.PENDING);
            user.setApplicationDate(LocalDateTime.now());
        } else {
            // Customer is automatically approved
            user.setApplicationStatus(User.ApplicationStatus.APPROVED);
            user.setApprovedDate(LocalDateTime.now());
        }
        
        User savedUser = userRepository.save(user);
        log.info("User registered successfully: {}", savedUser.getEmail());
        return new UserResponse(savedUser);
    }
    
    public LoginResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.error("User not found for email: {}", request.getEmail());
                    return new RuntimeException("Invalid email or password");
                });
        
        log.info("User found: {}, Role: {}, Active: {}, ApplicationStatus: {}", 
                user.getEmail(), user.getRole(), user.getIsActive(), user.getApplicationStatus());
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.error("Password mismatch for email: {}", request.getEmail());
            throw new RuntimeException("Invalid email or password");
        }
        
        if (!user.getIsActive()) {
            log.error("User account is inactive: {}", request.getEmail());
            throw new RuntimeException("Account is deactivated. Please contact support.");
        }
        
        // For sellers, check if they are approved
        if (user.getRole() == User.UserRole.SELLER && 
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
            String token = jwtUtil.generateToken(user.getEmail(), user.getId().toString(), user.getRole().name());
            UserResponse userResponse = new UserResponse(user);
            log.info("Login successful for email: {}", request.getEmail());
            return new LoginResponse(token, userResponse);
        } catch (Exception e) {
            log.error("Error generating token for user: {}", request.getEmail(), e);
            throw new RuntimeException("Failed to generate authentication token");
        }
    }
    
    public void logout(String token) {
        // Extract token from Bearer format
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // Add token to blacklist
        blacklistedTokens.add(token);
        log.info("Token blacklisted successfully");
    }
    
    public UserResponse getCurrentUser(String token) {
        // Extract token from Bearer format
        if (token.startsWith("Bearer ")) {
            token = token.substring(7);
        }
        
        // Check if token is blacklisted
        if (blacklistedTokens.contains(token)) {
            throw new RuntimeException("Token is no longer valid");
        }
        
        // Validate and extract user info from token
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