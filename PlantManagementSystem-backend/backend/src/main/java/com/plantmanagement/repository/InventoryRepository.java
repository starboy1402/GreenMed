package com.plantmanagement.repository;

import com.plantmanagement.entity.Inventory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {
    
    List<Inventory> findBySellerId(Long sellerId);

    // New methods for seller dashboard
    @Query("SELECT COUNT(i) FROM Inventory i WHERE i.seller.id = :sellerId AND i.quantity <= i.lowStockThreshold")
    long countLowStockItemsForSeller(@Param("sellerId") Long sellerId);

    long countBySellerId(Long sellerId);
}
