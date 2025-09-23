package com.plantmanagement.controller;

import com.plantmanagement.dto.PaymentRequest;
import com.plantmanagement.entity.Payment;
import com.plantmanagement.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:8081", "http://localhost:8082" })
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping("/order/{orderId}")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<?> makePayment(
            @PathVariable Long orderId,
            @RequestBody PaymentRequest paymentRequest, // Accept the request body
            Principal principal) {
        try {
            Payment payment = paymentService.processPayment(orderId, paymentRequest, principal.getName());
            return ResponseEntity.ok(payment);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
