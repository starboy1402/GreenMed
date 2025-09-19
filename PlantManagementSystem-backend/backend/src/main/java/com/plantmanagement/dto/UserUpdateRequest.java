package com.plantmanagement.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String name;
    private String phoneNumber;
    private String address;
    private String shopName;
}