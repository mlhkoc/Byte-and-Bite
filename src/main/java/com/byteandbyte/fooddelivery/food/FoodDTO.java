package com.byteandbyte.fooddelivery.food;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FoodDTO {
    private long id;
    private String name;
    private String description;
    private Double price;
}