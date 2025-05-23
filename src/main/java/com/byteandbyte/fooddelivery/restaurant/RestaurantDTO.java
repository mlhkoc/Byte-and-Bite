package com.byteandbyte.fooddelivery.restaurant;


import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantDTO {
    private Long id;
    private String name;
    private String address;
    private String cuisine;
    private double rating;
    private String deliveryTime;
    private double minOrder;
    private String image;

}


