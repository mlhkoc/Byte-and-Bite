package com.byteandbyte.fooddelivery.food;

import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.menu.Menu;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Food {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double price;
    private String description;

    @ManyToOne
    @JoinColumn(name = "menu_id")
    private Menu menu; // A food item belongs to one menu


}