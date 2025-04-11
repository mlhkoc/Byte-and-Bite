package com.byteandbyte.fooddelivery.order;
import lombok.*;
import jakarta.persistence.*;
import com.byteandbyte.fooddelivery.food.Food;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "food_id")
    private Food food;

    private int quantity;
    private double price;
}
