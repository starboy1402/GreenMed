package com.plantmanagement.controller;

import com.plantmanagement.dto.UserResponse;
import com.plantmanagement.entity.User;
import com.plantmanagement.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/sellers/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getPendingSellers() {
        List<User> pendingSellers = adminService.getPendingSellers();
        List<UserResponse> response = pendingSellers.stream()
                                                    .map(UserResponse::new)
                                                    .collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/sellers/{sellerId}/approve")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> approveSeller(@PathVariable Long sellerId) {
        adminService.approveSeller(sellerId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/sellers/{sellerId}/reject")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> rejectSeller(@PathVariable Long sellerId) {
        adminService.rejectSeller(sellerId);
        return ResponseEntity.ok().build();
    }
}