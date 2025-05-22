package com.byteandbyte.fooddelivery.review;

import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.order.Order;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private int rating;
    private String text;
    private LocalDateTime timestamp;

    @OneToOne
    @JoinColumn(name = "order_id", unique = true)
    private Order order;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Restaurant restaurant;
}