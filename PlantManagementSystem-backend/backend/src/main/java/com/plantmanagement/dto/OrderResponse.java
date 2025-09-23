package com.plantmanagement.dto;

import com.plantmanagement.entity.Order;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Data
public class OrderResponse {
    private Long id;
    private String customerName;
    private String customerEmail;
    private String customerPhoneNumber;
    private ShippingAddressDto shippingAddress;
    private String sellerShopName;
    private Double totalAmount;
    private String status;
    private LocalDateTime orderDate;
    private List<OrderItemDto> items;

    @Data
    public static class ShippingAddressDto {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;

        public ShippingAddressDto(String street, String city, String state, String zipCode, String country) {
            this.street = street;
            this.city = city;
            this.state = state;
            this.zipCode = zipCode;
            this.country = country;
        }
    }

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

    public OrderResponse(Order order) {
        this.id = order.getId();
        this.customerName = order.getCustomer().getName();
        this.customerEmail = order.getCustomer().getEmail();
        this.customerPhoneNumber = order.getCustomer().getPhoneNumber();
        if (order.getShippingAddress() != null) {
            this.shippingAddress = new ShippingAddressDto(
                    order.getShippingAddress().getStreet(),
                    order.getShippingAddress().getCity(),
                    order.getShippingAddress().getState(),
                    order.getShippingAddress().getZipCode(),
                    order.getShippingAddress().getCountry());
        }
        this.sellerShopName = order.getSeller().getShopName();
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