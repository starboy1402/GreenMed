package com.plantmanagement.dto;

import lombok.Data;
import java.util.List;

@Data
public class OrderRequest {
    private Long sellerId;
    private List<OrderItemDto> items;

    @Data
    public static class OrderItemDto {
        private Long inventoryItemId;
        private Integer quantity;
    }
}