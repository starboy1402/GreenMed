package com.plantmanagement.service;

import com.plantmanagement.entity.Inventory;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.InventoryRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.file.AccessDeniedException;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final UserRepository userRepository;

    public List<Inventory> getInventoryBySeller(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
        return inventoryRepository.findBySellerId(seller.getId());
    }

    public Inventory addInventoryItem(Inventory inventoryItem, String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
        inventoryItem.setSeller(seller);
        return inventoryRepository.save(inventoryItem);
    }

    public Inventory updateInventoryItem(Long itemId, Inventory updatedItem, String sellerEmail) throws AccessDeniedException {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new UsernameNotFoundException("Seller not found"));
        
        Inventory existingItem = inventoryRepository.findById(itemId)
                .orElseThrow(() -> new RuntimeException("Inventory item not found"));

        if (!existingItem.getSeller().getId().equals(seller.getId())) {
            throw new AccessDeniedException("You do not have permission to update this item.");
        }

        existingItem.setName(updatedItem.getName());
        existingItem.setType(updatedItem.getType());
        existingItem.setPrice(updatedItem.getPrice());
        existingItem.setQuantity(updatedItem.getQuantity());
        existingItem.setDescription(updatedItem.getDescription());
        existingItem.setLowStockThreshold(updatedItem.getLowStockThreshold());

        return inventoryRepository.save(existingItem);
    }
     public List<Inventory> getInventoryBySellerId(Long sellerId) {
        return inventoryRepository.findBySellerId(sellerId);
    }
}