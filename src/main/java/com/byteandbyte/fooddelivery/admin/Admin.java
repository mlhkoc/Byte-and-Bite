package com.byteandbyte.fooddelivery.admin;



import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Order;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    private String email;
    private String passwordHash;


}
