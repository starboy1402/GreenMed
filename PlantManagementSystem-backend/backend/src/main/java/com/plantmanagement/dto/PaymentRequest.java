package com.plantmanagement.dto;

import lombok.Data;

@Data
public class PaymentRequest {
    private String paymentMethod;
    private String transactionId; // Add this field
}

