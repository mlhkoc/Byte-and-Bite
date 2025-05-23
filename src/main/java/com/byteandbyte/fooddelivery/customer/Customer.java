package com.byteandbyte.fooddelivery.customer;

import com.byteandbyte.fooddelivery.cart.Cart;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Order;

import java.util.Date; // Import Date
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String passwordHash;
    private String address;
    private String phone;
    private int points;

    @OneToMany(mappedBy = "customer", cascade = CascadeType.PERSIST)
    private List<Order> orders;



    @OneToOne(mappedBy = "customer", cascade = CascadeType.ALL, orphanRemoval = true)
    private Cart cart;

}