package com.byteandbyte.fooddelivery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;

@SpringBootApplication
@EntityScan(basePackages = "com.byteandbyte.fooddelivery")
public class FooddeliveryApplication {

    public static void main(String[] args) {

        SpringApplication.run(FooddeliveryApplication.class, args);
    }

}
