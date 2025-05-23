package com.byteandbyte.fooddelivery.customer;

import com.byteandbyte.fooddelivery.cart.Cart;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Order;
import java.util.Date;
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

    @Column(nullable = false)
    private boolean approved = true; // Müşteri için varsayılan onaylı

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date submissionDate;

    @Column(nullable = false)
    private boolean active = true; // Onaylandıktan sonra varsayılan olarak aktif.

    @Column(nullable = false)
    private boolean banned = false; // Varsayılan olarak banlı değil.

    @Column(length = 500)
    private String banReason;

    @Column(nullable = true) // Null olabilir, yani süresiz deaktif veya hiç deaktif edilmemiş
    @Temporal(TemporalType.TIMESTAMP)
    private Date deactivationEndDate;

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) {
            this.submissionDate = new Date();
        }
        // approved müşteri için zaten true
        // active ve banned varsayılan değerlerini korur
    }
}