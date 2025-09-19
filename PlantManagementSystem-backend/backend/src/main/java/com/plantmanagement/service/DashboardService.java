package com.plantmanagement.service;

import com.plantmanagement.dto.AdminDashboardStatsDTO;
import com.plantmanagement.dto.SellerDashboardStatsDTO;
import com.plantmanagement.entity.Order;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.InventoryRepository;
import com.plantmanagement.repository.OrderRepository;
import com.plantmanagement.repository.PaymentRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final InventoryRepository inventoryRepository;

    public AdminDashboardStatsDTO getAdminDashboardStats() {
        // This is the corrected implementation using our specific repository methods
        long totalCustomers = userRepository.countTotalCustomers();
        long totalSellers = userRepository.countTotalSellers();
        long totalOrders = orderRepository.countPaidOrders();
        long pendingSellers = userRepository.countPendingSellers();

        return new AdminDashboardStatsDTO(totalCustomers, totalSellers, totalOrders, pendingSellers);
    }

    public SellerDashboardStatsDTO getSellerDashboardStats(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Double revenue = paymentRepository.calculateTotalRevenueForSeller(seller.getId());
        double totalRevenue = (revenue != null) ? revenue : 0.0;

        long activeOrders = orderRepository.countActiveOrdersForSeller(seller.getId());
        long lowStockItems = inventoryRepository.countLowStockItemsForSeller(seller.getId());
        long totalProducts = inventoryRepository.countBySellerId(seller.getId());
        List<Order> recentOrders = orderRepository.findTop5BySellerIdOrderByOrderDateDesc(seller.getId());
        
        return new SellerDashboardStatsDTO(totalRevenue, activeOrders, lowStockItems, totalProducts, recentOrders);
    }
}

