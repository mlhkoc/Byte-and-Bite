package com.byteandbyte.fooddelivery.courier;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Delivery;

import java.util.ArrayList;
import java.util.Date; // Import Date
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
// @Getter // Redundant with @Data
// @Setter // Redundant with @Data
public class Courier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private boolean isAvailable; // Current availability for taking orders

    @Column(nullable = false)
    private boolean approved = false; // For admin approval of registration

    @Temporal(TemporalType.TIMESTAMP)
    @Column(nullable = false)
    private Date submissionDate;

    @OneToMany(mappedBy = "courier", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Delivery> deliveries = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) {
            this.submissionDate = new Date();
        }
        // 'approved' is already false by default
    }
}