package com.plantmanagement.dto;

import com.plantmanagement.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;


// User Response DTO
@Data
public class UserResponse {
    private String id;
    private String name;
    private String email;
    private String role;
    private Boolean isActive;
    private String businessName;
    private String phoneNumber;
    private String address;
    private String applicationStatus;
    private LocalDateTime applicationDate;
    private LocalDateTime approvedDate;
    private LocalDateTime createdAt;
    
    public UserResponse(User user) {
        this.id = user.getId().toString();
        this.name = user.getName();
        this.email = user.getEmail();
        this.role = user.getRole().name().toLowerCase();
        this.isActive = user.getIsActive();
        this.businessName = user.getBusinessName();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.applicationStatus = user.getApplicationStatus() != null ? 
                                user.getApplicationStatus().name().toLowerCase() : null;
        this.applicationDate = user.getApplicationDate();
        this.approvedDate = user.getApprovedDate();
        this.createdAt = user.getCreatedAt();
    }
}