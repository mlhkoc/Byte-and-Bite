package com.byteandbyte.fooddelivery.customer;

import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Order;
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

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;


}