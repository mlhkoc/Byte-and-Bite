package com.byteandbyte.fooddelivery.courier;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import com.byteandbyte.fooddelivery.order.Delivery;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Courier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String passwordHash;
    private String phone;
    private boolean isAvailable; // Operasyonel durumu

    @Column(nullable = false)
    private boolean approved = false; // Kayıt onayı

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

    @OneToMany(mappedBy = "courier", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Delivery> deliveries = new ArrayList<>();

    @PrePersist
    protected void onCreate() {
        if (this.submissionDate == null) {
            this.submissionDate = new Date();
        }
        // approved kurye için varsayılan false
    }
}