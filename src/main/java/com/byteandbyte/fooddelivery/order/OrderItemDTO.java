package com.byteandbyte.fooddelivery.order;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderItemDTO {
    private Long foodId;
    private String foodName;
    private int quantity;
    private double price;


}