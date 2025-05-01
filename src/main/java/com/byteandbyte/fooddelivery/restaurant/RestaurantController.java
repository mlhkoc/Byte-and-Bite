package com.byteandbyte.fooddelivery.restaurant;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Math.max;

@RestController
@RequestMapping("/api")
public class RestaurantController {

    private final RestaurantRepository restaurantRepository;

    @Autowired
    public RestaurantController(RestaurantRepository restaurantRepository) {
        this.restaurantRepository = restaurantRepository;

    }

    public RestaurantDTO toDTO(Restaurant r) {
        Long id = r.getId();
        String name = r.getName() != null ? r.getName() : "";
        String cuisine = r.getCuisine() != null ? r.getCuisine() : "";
        double rating = max(r.getRating(),0.0);
        String deliveryTime = r.getDeliveryTime() != null ? r.getDeliveryTime() : "";
        double minOrder = max(r.getMinOrder(),0.0);
        String image = r.getImage() != null ? r.getImage() : "default.png"; // or null-safe
        return new RestaurantDTO(id,name,cuisine,rating,deliveryTime,minOrder,image);
    }

    @GetMapping("/restaurants")
    public List<RestaurantDTO> getAllRestaurants() {
        return restaurantRepository.findAll()
                .stream().map(this::toDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/restaurants/mail/{restaurantMail}")
    public RestaurantDTO getRestaurant(@PathVariable String restaurantMail) {
        Restaurant restaurant = restaurantRepository.findByEmail(restaurantMail)
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return toDTO(restaurant);
    }

    @GetMapping("/restaurants/id/{restaurantId}")
    public RestaurantDTO getRestaurant(@PathVariable Long restaurantId) {
        Restaurant restaurant = restaurantRepository.findById( restaurantId )
            .orElseThrow(() -> new RuntimeException("Restaurant not found"));
        return toDTO(restaurant);
    }

    @GetMapping("/restaurant-id/{mail}")
    public Long getRestaurantIdByMail(@PathVariable String mail) {
        return restaurantRepository.findByEmail(mail)
                .orElseThrow(() -> new RuntimeException("Restaurant not found"))
                .getId();
    }

}
