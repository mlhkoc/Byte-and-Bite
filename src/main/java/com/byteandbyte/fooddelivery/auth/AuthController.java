package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.courier.CourierService;
import com.byteandbyte.fooddelivery.customer.CustomerService;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import com.byteandbyte.fooddelivery.courier.Courier;
import org.springframework.web.bind.annotation.*;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.auth.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;
    private final CourierService courierService;

    @Autowired
    public AuthController(AuthService authService, CourierService courierService) {
        this.authService = authService;
        this.courierService = courierService;
    }


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");
            String passwordHash = (String) payload.get("password");
            String phone = (String) payload.get("phoneNumber");
            String name = (String) payload.get("fullName");
            String role = (String) (payload.get("role"));
            System.out.println(role );
            String restaurantName = (String) payload.get("restaurantName");

            if (role.equals("customer")) {
                Customer customer = new Customer();
                customer.setEmail(email);
                customer.setPasswordHash(passwordHash);
                customer.setPhone(phone);
                customer.setName(name);
                authService.registerNewCustomer(customer);
                return ResponseEntity.ok("User registered!");
            }

            else if (role.equals("restaurant")) {
                Restaurant restaurant = new Restaurant();
                restaurant.setEmail(email);
                restaurant.setPasswordHash(passwordHash);
                restaurant.setPhone(phone);
                restaurant.setName(restaurantName);
                authService.registerNewRestaurant(restaurant);
                return ResponseEntity.ok("User registered!");
            }
            else if (role.equals("courier")) {
                Courier courier = new Courier();
                courier.setEmail(email);
                courier.setPasswordHash(passwordHash);
                courier.setPhone(phone);
                courier.setName(name);
                authService.registerNewCourier(courier);
                return ResponseEntity.ok("User registered!");
            }
            else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user");


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user");
        }
    }
}
