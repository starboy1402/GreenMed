package com.plantmanagement.repository;

import com.plantmanagement.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.status = 'COMPLETED'")
    Double calculateTotalRevenue();

    // New method for seller-specific revenue
    @Query("SELECT SUM(p.amount) FROM Payment p WHERE p.order.seller.id = :sellerId AND p.status = 'COMPLETED'")
    Double calculateTotalRevenueForSeller(@Param("sellerId") Long sellerId);
}

