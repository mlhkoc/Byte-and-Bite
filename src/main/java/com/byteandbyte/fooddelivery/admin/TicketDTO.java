package com.byteandbyte.fooddelivery.admin;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class TicketDTO {
    private Long id;
    private Long orderId;
    private String customerEmail;
    private String message;
    private String status;
}