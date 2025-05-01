package com.byteandbyte.fooddelivery.courier;

import com.byteandbyte.fooddelivery.cart.CartItem;
import com.byteandbyte.fooddelivery.order.Order;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Delivery;

import java.util.ArrayList;
import java.util.List;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Courier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String name;
    private String email;
    private String passwordHash;
    private String phone;


    @OneToMany(mappedBy = "courier", cascade = CascadeType.ALL)
    private List<Delivery> deliveries = new ArrayList<>();






}
