package com.byteandbyte.fooddelivery.review;

import lombok.Data;

@Data
public class ReviewDTO {
    private Long orderId;
    private Long restaurantId;
    private int rating;
    private String comment;
}