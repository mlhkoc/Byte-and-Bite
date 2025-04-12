package com.byteandbyte.fooddelivery.restaurant;

import com.byteandbyte.fooddelivery.customer.Customer;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RestaurantService {

    @Autowired
    private final RestaurantRepository restaurantRepository;

    public Restaurant findByEmail(String email) {
        return restaurantRepository.findByEmail(email).orElse(null);

    }
}
