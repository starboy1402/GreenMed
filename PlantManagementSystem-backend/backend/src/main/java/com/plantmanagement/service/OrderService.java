package com.plantmanagement.service;

import com.plantmanagement.dto.OrderRequest;
import com.plantmanagement.entity.Inventory;
import com.plantmanagement.entity.Order;
import com.plantmanagement.entity.OrderItem;
import com.plantmanagement.entity.ShippingAddress;
import com.plantmanagement.entity.User;
import com.plantmanagement.repository.InventoryRepository;
import com.plantmanagement.repository.OrderRepository;
import com.plantmanagement.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final InventoryRepository inventoryRepository;

    public Order createOrder(OrderRequest orderRequest, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // All items in a single order must come from the same seller
        User seller = userRepository.findById(orderRequest.getSellerId())
                .orElseThrow(() -> new RuntimeException("Seller not found"));

        Order order = new Order();
        order.setCustomer(customer);
        order.setSeller(seller);
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(Order.OrderStatus.PENDING_PAYMENT);

        // Create shipping address if provided
        if (orderRequest.getShippingAddress() != null) {
            ShippingAddress shippingAddress = new ShippingAddress();
            shippingAddress.setStreet(orderRequest.getShippingAddress().getStreet());
            shippingAddress.setCity(orderRequest.getShippingAddress().getCity());
            shippingAddress.setState(orderRequest.getShippingAddress().getState());
            shippingAddress.setZipCode(orderRequest.getShippingAddress().getZipCode());
            shippingAddress.setCountry(orderRequest.getShippingAddress().getCountry());
            shippingAddress.setUser(customer); // Link to customer
            order.setShippingAddress(shippingAddress);
        }

        List<OrderItem> orderItems = orderRequest.getItems().stream().map(itemDto -> {
            Inventory inventoryItem = inventoryRepository.findById(itemDto.getInventoryItemId())
                    .orElseThrow(
                            () -> new RuntimeException("Inventory item not found: " + itemDto.getInventoryItemId()));

            if (inventoryItem.getQuantity() < itemDto.getQuantity()) {
                throw new RuntimeException("Not enough stock for item: " + inventoryItem.getName());
            }

            // Decrease the stock
            inventoryItem.setQuantity(inventoryItem.getQuantity() - itemDto.getQuantity());
            inventoryRepository.save(inventoryItem);

            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setInventoryItem(inventoryItem);
            orderItem.setQuantity(itemDto.getQuantity());
            orderItem.setPrice(inventoryItem.getPrice()); // Price at the time of purchase
            return orderItem;
        }).collect(Collectors.toList());

        order.setItems(orderItems);
        order.setTotalAmount(orderItems.stream().mapToDouble(item -> item.getPrice() * item.getQuantity()).sum());

        return orderRepository.save(order);
    }

    public List<Order> getOrdersByCustomer(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return orderRepository.findByCustomerId(customer.getId());
    }

    public List<Order> getOrdersBySeller(String sellerEmail) {
        User seller = userRepository.findByEmail(sellerEmail)
                .orElseThrow(() -> new RuntimeException("Seller not found"));
        return orderRepository.findBySellerId(seller.getId());
    }

    public Order processPayment(Long orderId, String customerEmail) throws AccessDeniedException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));

        // Security check: ensure the user paying is the one who created the order
        if (!order.getCustomer().getId().equals(customer.getId())) {
            throw new AccessDeniedException("You are not authorized to pay for this order.");
        }

        if (order.getStatus() == Order.OrderStatus.PENDING_PAYMENT) {
            order.setStatus(Order.OrderStatus.PROCESSING);
            return orderRepository.save(order);
        } else {
            throw new RuntimeException("Order is not pending payment.");
        }
    }

    public Order updateOrderStatus(Long orderId, Order.OrderStatus status, String userEmail)
            throws AccessDeniedException {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Only the seller of the order or an admin can update the status
        if (!order.getSeller().getId().equals(user.getId()) && user.getUserType() != User.UserRole.ADMIN) {
            throw new AccessDeniedException("You are not authorized to update this order.");
        }

        order.setStatus(status);
        return orderRepository.save(order);
    }
}