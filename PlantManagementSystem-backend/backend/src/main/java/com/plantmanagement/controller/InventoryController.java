package com.plantmanagement.controller;

import com.plantmanagement.entity.Inventory;
import com.plantmanagement.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/inventory")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:8081", "http://localhost:8082" })
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<List<Inventory>> getSellerInventory(Principal principal) {
        return ResponseEntity.ok(inventoryService.getInventoryBySeller(principal.getName()));
    }

    // This is the new public endpoint
    @GetMapping("/seller/{sellerId}")
    public ResponseEntity<List<Inventory>> getInventoryBySellerId(@PathVariable Long sellerId) {
        return ResponseEntity.ok(inventoryService.getInventoryBySellerId(sellerId));
    }

    @PostMapping
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<Inventory> addInventoryItem(@RequestBody Inventory inventoryItem, Principal principal) {
        return ResponseEntity.ok(inventoryService.addInventoryItem(inventoryItem, principal.getName()));
    }

    @PutMapping("/{itemId}")
    @PreAuthorize("hasRole('SELLER')")
    public ResponseEntity<?> updateInventoryItem(@PathVariable Long itemId, @RequestBody Inventory updatedItem,
            Principal principal) {
        try {
            Inventory item = inventoryService.updateInventoryItem(itemId, updatedItem, principal.getName());
            return ResponseEntity.ok(item);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).body("Access Denied");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}