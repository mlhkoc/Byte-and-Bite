package com.byteandbyte.fooddelivery.order;

import java.util.List;
import java.util.stream.Collectors;

public class OrderDTO {
    private Long restaurantId;
    private List<OrderItemDTO> items;

    public Long getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(Long restaurantId) {
        this.restaurantId = restaurantId;
    }

    public List<OrderItemDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemDTO> items) {
        this.items = items;
    }

    public static OrderDTO fromEntity(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setRestaurantId(order.getRestaurant().getId());

        List<OrderItemDTO> items = order.getItems().stream().map(item -> {
            OrderItemDTO itemDTO = new OrderItemDTO();
            itemDTO.setFoodId(item.getFood().getId());
            itemDTO.setFoodName(item.getFood().getName());
            itemDTO.setQuantity(item.getQuantity());
            return itemDTO;
        }).collect(Collectors.toList());

        dto.setItems(items);
        return dto;
    }
}