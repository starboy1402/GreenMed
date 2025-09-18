package com.plantmanagement.service;

import com.plantmanagement.dto.AdminDashboardStatsDTO;
import com.plantmanagement.repository.OrderRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public AdminDashboardStatsDTO getAdminDashboardStats() {
        long totalCustomers = userRepository.countTotalCustomers();
        long totalSellers = userRepository.countTotalSellers();
        long totalOrders = orderRepository.count(); // use JpaRepository.count() to get total orders; add a repository method if you need only paid orders
        long pendingSellers = userRepository.countPendingSellers();

        return new AdminDashboardStatsDTO(totalCustomers, totalSellers, totalOrders, pendingSellers);
    }
}

