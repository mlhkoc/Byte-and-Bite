package com.byteandbyte.fooddelivery.customer;

import lombok.Data;

@Data
public class CustomerDTO {
    private String fullName;
    private String email;
    private String phone;
    private String address;
}