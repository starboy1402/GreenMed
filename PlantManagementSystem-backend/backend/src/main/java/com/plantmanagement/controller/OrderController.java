package com.plantmanagement.controller;

import com.plantmanagement.dto.OrderRequest;
import com.plantmanagement.dto.OrderResponse;
import com.plantmanagement.entity.Order;
import com.plantmanagement.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@CrossOrigin(origins = { "http://localhost:8081", "http://localhost:8082" })
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<Order> createOrder(@RequestBody OrderRequest orderRequest, Principal principal) {
        try {
            Order order = orderService.createOrder(orderRequest, principal.getName());
            return ResponseEntity.ok(order);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @GetMapping("/customer")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<List<OrderResponse>> getCustomerOrders(Principal principal) {
        List<Order> orders = orderService.getOrdersByCustomer(principal.getName());
        List<OrderResponse> orderResponses = orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderResponses);
    }

    @GetMapping("/seller")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<List<OrderResponse>> getSellerOrders(Principal principal) {
        List<Order> orders = orderService.getOrdersBySeller(principal.getName());
        List<OrderResponse> orderResponses = orders.stream()
                .map(OrderResponse::new)
                .collect(Collectors.toList());
        return ResponseEntity.ok(orderResponses);
    }

    @PostMapping("/{orderId}/pay")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<OrderResponse> payForOrder(@PathVariable Long orderId, Principal principal) {
        try {
            Order paidOrder = orderService.processPayment(orderId, principal.getName());
            OrderResponse response = new OrderResponse(paidOrder);
            return ResponseEntity.ok(response);
        } catch (AccessDeniedException e) {
            return ResponseEntity.status(403).build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{orderId}/status")
    @PreAuthorize("hasRole('SELLER') or hasRole('ADMIN')")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam("status") Order.OrderStatus status,
            Principal principal) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(orderId, status, principal.getName());
            OrderResponse response = new OrderResponse(updatedOrder);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}