package com.plantmanagement.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long sellerId;
    private List<OrderItemDto> items;
    private ShippingAddressDto shippingAddress;

    @Data
    public static class OrderItemDto {
        private Long inventoryItemId;
        private Integer quantity;
    }

    @Data
    public static class ShippingAddressDto {
        private String street;
        private String city;
        private String state;
        private String zipCode;
        private String country;
    }
}