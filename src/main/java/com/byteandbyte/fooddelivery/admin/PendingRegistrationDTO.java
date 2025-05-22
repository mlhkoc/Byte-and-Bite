package com.byteandbyte.fooddelivery.admin; // Place in admin package or a common DTO package

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PendingRegistrationDTO {
    private Long id; // Actual entity ID (Customer ID, Restaurant ID, Courier ID)
    private String name; // Full name or restaurant name
    private String email;
    private String type; // "CUSTOMER", "RESTAURANT", "COURIER"
    private Date submissionDate;
    // No restaurantName explicitly needed if 'name' field correctly holds restaurant name for type 'RESTAURANT'
}