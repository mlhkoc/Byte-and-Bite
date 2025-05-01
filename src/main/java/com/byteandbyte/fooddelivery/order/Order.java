package com.byteandbyte.fooddelivery.order;

import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.food.Food;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL)
    private List<OrderItem> items;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "delivery_id")
    private Delivery delivery;


    private LocalDateTime orderTime;
    private String status;
    private LocalDateTime deliveryTime;
    private double price;
    private String note;


    public void setCreatedAt(LocalDateTime now) {

    }
}