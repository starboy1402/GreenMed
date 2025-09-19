package com.plantmanagement.dto;

import com.plantmanagement.entity.Order;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class AdminOrderResponse {
    private Long id;
    private String customerName;
    private String sellerName;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private String productName;
        private Integer quantity;
        private Double price;

        public OrderItemDto(String productName, Integer quantity, Double price) {
            this.productName = productName;
            this.quantity = quantity;
            this.price = price;
        }
    }

    public AdminOrderResponse(Order order) {
        this.id = order.getId();
        this.customerName = order.getCustomer().getName();
        this.sellerName = order.getSeller().getName();
        this.totalAmount = order.getTotalAmount();
        this.status = order.getStatus().name();
        this.orderDate = order.getOrderDate();
        this.items = order.getItems().stream()
                .map(item -> new OrderItemDto(
                        item.getInventoryItem().getName(),
                        item.getQuantity(),
                        item.getPrice()))
                .collect(Collectors.toList());
    }
}