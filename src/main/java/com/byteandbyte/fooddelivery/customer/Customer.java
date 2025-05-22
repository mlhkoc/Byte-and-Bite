package com.byteandbyte.fooddelivery.customer;

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
// @Getter // Redundant with @Data
// @Setter // Redundant with @Data
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
    private boolean approved = false; // Default to false

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date submissionDate;

    @OneToMany(mappedBy = "customer")
    private List<Order> orders;

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) { // Ensure it's only set on creation
            this.submissionDate = new Date();
        }
        // 'approved' is already false by default
    }
}