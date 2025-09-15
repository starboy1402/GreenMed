package com.plantmanagement.dto;

import com.plantmanagement.entity.User;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;


// Login Response DTO
@Data
public class LoginResponse {
    private String token;
    private String tokenType = "Bearer";
    private UserResponse user;
    
    public LoginResponse(String token, UserResponse user) {
        this.token = token;
        this.user = user;
    }
}