package com.plantmanagement.repository;

import com.plantmanagement.entity.Order;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    List<Order> findByCustomerId(Long customerId);

    List<Order> findBySellerId(Long sellerId);
    
    @Query("SELECT COUNT(o) FROM Order o WHERE o.status != 'PENDING_PAYMENT' AND o.status != 'CANCELLED'")
    long countPaidOrders();

    // New methods for seller dashboard
    @Query("SELECT COUNT(o) FROM Order o WHERE o.seller.id = :sellerId AND (o.status = 'PROCESSING' OR o.status = 'SHIPPED')")
    long countActiveOrdersForSeller(@Param("sellerId") Long sellerId);

    List<Order> findTop5BySellerIdOrderByOrderDateDesc(Long sellerId);
}

