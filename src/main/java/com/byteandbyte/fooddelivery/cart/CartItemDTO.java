package com.byteandbyte.fooddelivery.cart;



import com.byteandbyte.fooddelivery.food.Food;

import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDTO {
    private long id;
    private String name;
    private int quantity;
    private double price;
    private String image;
}
