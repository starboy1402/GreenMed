package com.plantmanagement.dto;

import com.plantmanagement.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SellerDashboardStatsDTO {
    private double totalRevenue;
    private long activeOrders;
    private long lowStockItems;
    private long totalProducts;
    private List<Order> recentOrders;
}
