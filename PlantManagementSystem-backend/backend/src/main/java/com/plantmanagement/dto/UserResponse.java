package com.plantmanagement.dto;

import com.plantmanagement.entity.User;
import lombok.Data;

// User Response DTO
@Data
public class UserResponse {
    private String id;
    private String name;
    private String email;
    // Renamed from 'role' to 'userType'
    private String userType;
    private Boolean isActive;
    // Renamed from 'businessName' to 'shopName'
    private String shopName;
    private String phoneNumber;
    private String address;
    private String applicationStatus;
    
    // Removed applicationDate, approvedDate, and createdAt as requested.

    public UserResponse(User user) {
        this.id = user.getId().toString();
        this.name = user.getName();
        this.email = user.getEmail();
        // Updated to use getUserType()
        this.userType = user.getUserType().name().toLowerCase();
        this.isActive = user.getIsActive();
        // Updated to use getShopName()
        this.shopName = user.getShopName();
        this.phoneNumber = user.getPhoneNumber();
        this.address = user.getAddress();
        this.applicationStatus = user.getApplicationStatus() != null ? 
                                user.getApplicationStatus().name().toLowerCase() : null;
    }
}