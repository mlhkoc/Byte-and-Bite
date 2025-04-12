package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.customer.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.auth.AuthService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }


    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");
            String passwordHash = (String) payload.get("password");
            String phone = (String) payload.get("phoneNumber");
            String name = (String) payload.get("fullName");

            // Manually create the Customer object
            Customer customer = new Customer();
            customer.setEmail(email);
            customer.setPasswordHash(passwordHash);
            customer.setPhone(phone);
            customer.setName(name);

            authService.registerNewCustomer(customer);
            return ResponseEntity.ok("User registered!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user");
        }
    }
}
