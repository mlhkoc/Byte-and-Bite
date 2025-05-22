package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.courier.CourierService;
import com.byteandbyte.fooddelivery.customer.CustomerService;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import com.byteandbyte.fooddelivery.courier.Courier;
import org.springframework.web.bind.annotation.*;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.security.CustomUserDetailsService;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class AuthController {

    private final AuthService authService;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService customUserDetailsService;



    @Autowired
    public AuthController(AuthService authService, JwtUtil jwtUtil, CustomUserDetailsService customUserDetailsService, AuthenticationManager authenticationManager) {
        this.authService = authService;
        this.jwtUtil = jwtUtil;
        this.customUserDetailsService = customUserDetailsService;
        this.authenticationManager = authenticationManager;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials");
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.replace("ROLE_", ""))
                .findFirst()
                .orElse("UNKNOWN");

        String token = jwtUtil.generateToken(userDetails.getUsername(), role); // updated

        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), role));

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
                courier.setAvailable(true);
                authService.registerNewCourier(courier);
                return ResponseEntity.ok("User registered!");
            }
            else return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user");


        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to register user");
        }
    }
}
