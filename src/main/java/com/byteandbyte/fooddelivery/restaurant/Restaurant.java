package com.byteandbyte.fooddelivery.restaurant;

import java.util.Date;
import java.util.List;
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
    private String cuisine;
    private double minOrder;
    private String deliveryTime;
    private String image;
    private double rating;

    @Column(nullable = false)
    private boolean approved = false; // Restoran için onay beklenir

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

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Menu> menus;

    @OneToMany(mappedBy = "restaurant", cascade = CascadeType.ALL)
    private List<Order> orders;

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) {
            this.submissionDate = new Date();
        }
        // approved restoran için varsayılan false
    }
}