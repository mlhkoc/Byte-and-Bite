package com.byteandbyte.fooddelivery.order;

import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.courier.Courier;

import java.security.PrivateKey;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Delivery {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(mappedBy = "delivery")
    private Order order;


    private String status;

    private String address;


    private LocalDateTime deliveryDate;





    @ManyToOne
    @JoinColumn(name = "courier_id")
    private Courier courier;
}
