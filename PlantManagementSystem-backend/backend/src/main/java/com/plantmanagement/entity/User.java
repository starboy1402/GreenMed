// File: PlantManagementSystem-backend/backend/src/main/java/com/plantmanagement/entity/User.java
package com.plantmanagement.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 100, message = "Name must be between 2 and 100 characters")
    private String name;
    
    @Column(nullable = false, unique = true)
    @Email(message = "Please provide a valid email")
    @NotBlank(message = "Email is required")
    private String email;
    
    @Column(nullable = false)
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters long")
    private String password;
    
    // Renamed from 'role' to 'userType' to match the schema
    @Column(name = "user_type", nullable = false)
    @Enumerated(EnumType.STRING)
    private UserRole userType;
    
    @Column(name = "is_active", nullable = false)
    private Boolean isActive = true;
    
    // Renamed from 'businessName' to 'shopName'
    @Column(name = "shop_name")
    private String shopName;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @Column(columnDefinition = "TEXT")
    private String address;
    
    @Column(name = "application_status")
    @Enumerated(EnumType.STRING)
    private ApplicationStatus applicationStatus = ApplicationStatus.PENDING;
    
    // Removed the date and approval tracking fields as requested
    
    public enum UserRole {
        CUSTOMER, SELLER, ADMIN
    }
    
    public enum ApplicationStatus {
        PENDING, APPROVED, REJECTED
    }
}