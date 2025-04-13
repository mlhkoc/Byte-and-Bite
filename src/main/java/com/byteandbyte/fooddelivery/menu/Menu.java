package com.byteandbyte.fooddelivery.menu;

import java.util.List;
import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Menu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant; // Menu belongs to one restaurant

    @OneToMany(mappedBy = "menu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Food> foodItems; // Menu directly contains a list of food items
}