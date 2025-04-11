package com.byteandbyte.fooddelivery.restaurant;

import java.util.List;
import jakarta.annotation.Nullable;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.menu.Menu;
import com.byteandbyte.fooddelivery.order.Order;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String passwordHash;
    private String name;
    private String address;
    private String phone;
    private String email;
    private String cuisineType;
    private double rating;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Menu> menus;

    @OneToMany(mappedBy = "restaurant")
    private List<Order> orders;




}