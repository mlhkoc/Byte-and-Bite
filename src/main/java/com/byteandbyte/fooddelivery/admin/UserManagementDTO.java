package com.byteandbyte.fooddelivery.admin;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserManagementDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String role;
    private boolean approved;
    private boolean active;
    private boolean banned;
    private String banReason;
    private Date submissionDate;
    private Date deactivationEndDate; // YENİ ALAN

    // fromCustomer, fromRestaurant, fromCourier metotlarını güncelleyin
    public static UserManagementDTO fromCustomer(com.byteandbyte.fooddelivery.customer.Customer customer) {
        if (customer == null) return null;
        return new UserManagementDTO(
                customer.getId(), customer.getName(), customer.getEmail(), customer.getPhone(),
                "CUSTOMER", customer.isApproved(), customer.isActive(), customer.isBanned(),
                customer.getBanReason(), customer.getSubmissionDate(), customer.getDeactivationEndDate() // YENİ
        );
    }

    public static UserManagementDTO fromRestaurant(com.byteandbyte.fooddelivery.restaurant.Restaurant restaurant) {
        if (restaurant == null) return null;
        return new UserManagementDTO(
                restaurant.getId(), restaurant.getName(), restaurant.getEmail(), restaurant.getPhone(),
                "RESTAURANT", restaurant.isApproved(), restaurant.isActive(), restaurant.isBanned(),
                restaurant.getBanReason(), restaurant.getSubmissionDate(), restaurant.getDeactivationEndDate() // YENİ
        );
    }

    public static UserManagementDTO fromCourier(com.byteandbyte.fooddelivery.courier.Courier courier) {
        if (courier == null) return null;
        return new UserManagementDTO(
                courier.getId(), courier.getName(), courier.getEmail(), courier.getPhone(),
                "COURIER", courier.isApproved(), courier.isActive(), courier.isBanned(),
                courier.getBanReason(), courier.getSubmissionDate(), courier.getDeactivationEndDate() // YENİ
        );
    }
}