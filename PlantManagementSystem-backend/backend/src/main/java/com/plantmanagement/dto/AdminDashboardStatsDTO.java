package com.plantmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDashboardStatsDTO {
    private long totalCustomers;
    private long totalSellers;
    private long totalOrders;
    private long pendingSellers;
}

