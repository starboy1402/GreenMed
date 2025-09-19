package com.plantmanagement.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PublicStatsDTO {
    private long totalCustomers;
    private long totalSellers;
    private long totalOrders;
    private long totalProducts;
}