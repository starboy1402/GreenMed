package com.plantmanagement.controller;

import com.plantmanagement.dto.AdminDashboardStatsDTO;
import com.plantmanagement.dto.SellerDashboardStatsDTO;
import com.plantmanagement.dto.PublicStatsDTO;
import com.plantmanagement.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:8081")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin-stats")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AdminDashboardStatsDTO> getAdminStats() {
        return ResponseEntity.ok(dashboardService.getAdminDashboardStats());
    }

    @GetMapping("/seller-stats")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<SellerDashboardStatsDTO> getSellerStats(Principal principal) {
        return ResponseEntity.ok(dashboardService.getSellerDashboardStats(principal.getName()));
    }

    @GetMapping("/public-stats")
    public ResponseEntity<PublicStatsDTO> getPublicStats() {
        return ResponseEntity.ok(dashboardService.getPublicStats());
    }
}
