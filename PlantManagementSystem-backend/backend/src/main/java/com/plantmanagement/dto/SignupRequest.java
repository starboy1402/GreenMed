package com.plantmanagement.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

// Signup Request DTO
@Data
public class SignupRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    // Renamed from 'role' to 'userType'
    @NotBlank(message = "User type is required")
    private String userType; // "CUSTOMER" or "SELLER"
    
    // Additional fields for sellers
    // Renamed from 'businessName' to 'shopName'
    private String shopName;
    private String phoneNumber;
    private String address;
}