package com.byteandbyte.fooddelivery.cart;


import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.food.Food;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food foodItem;

    private int quantity;
    private double price;
}