package com.byteandbyte.fooddelivery.admin;


import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Order;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Ticket {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private LocalDateTime createdAt;

    private Long orderId;

    private String status;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;


    @ManyToOne
    @JoinColumn(name = "courier_id")
    private Courier courier;



    @ManyToOne
    @JoinColumn(name = "restaurant_id")
    private Restaurant restaurant;






}
