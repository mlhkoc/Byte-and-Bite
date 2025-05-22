package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.courier.Courier;
// import com.byteandbyte.fooddelivery.courier.CourierService; // Not directly used in this controller
import com.byteandbyte.fooddelivery.customer.Customer;
// import com.byteandbyte.fooddelivery.customer.CustomerService; // Not directly used
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.authentication.*;
import org.springframework.security.core.AuthenticationException; // Import general AuthenticationException
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;

import com.byteandbyte.fooddelivery.security.CustomUserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap; // For simpler response map
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
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid username or password.");
        } catch (DisabledException e) {
            // CustomUserDetailsService will throw this if approved == false
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage()); // Use FORBIDDEN (403) for clarity
        } catch (AuthenticationException e) { // Catch other authentication issues
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Authentication failed: " + e.getMessage());
        }

        UserDetails userDetails = customUserDetailsService.loadUserByUsername(request.getUsername());
        String role = userDetails.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .map(auth -> auth.replace("ROLE_", "")) // "CUSTOMER", "RESTAURANT", "COURIER"
                .findFirst()
                .orElse("UNKNOWN");

        String token = jwtUtil.generateToken(userDetails.getUsername(), role);

        return ResponseEntity.ok(new AuthResponse(token, userDetails.getUsername(), role));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, Object> payload) {
        try {
            String email = (String) payload.get("email");
            String password = (String) payload.get("password"); // Raw password from form
            String phone = (String) payload.get("phoneNumber");
            String name = (String) payload.get("fullName");
            String role = (String) payload.get("role"); // "customer", "restaurant", "courier" from frontend
            String restaurantName = (String) payload.get("restaurantName"); // Only for restaurants

            if (email == null || email.trim().isEmpty() ||
                password == null || password.trim().isEmpty() ||
                role == null || role.trim().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body(Map.of("message", "Email, password, and role are required."));
            }
            if (role.equalsIgnoreCase("restaurant") && (restaurantName == null || restaurantName.trim().isEmpty())) {
                 return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                     .body(Map.of("message", "Restaurant name is required for restaurant role."));
            }


            switch (role.toLowerCase()) {
                case "customer":
                    Customer customer = new Customer();
                    customer.setEmail(email);
                    customer.setPasswordHash(password); // AuthService will hash it
                    customer.setPhone(phone);
                    customer.setName(name);
                    // 'approved' and 'submissionDate' set by @PrePersist and default in AuthService
                    authService.registerNewCustomer(customer);
                    break;
                case "restaurant":
                    Restaurant restaurant = new Restaurant();
                    restaurant.setEmail(email);
                    restaurant.setPasswordHash(password); // AuthService will hash it
                    restaurant.setPhone(phone);
                    restaurant.setName(restaurantName); // Use restaurantName for Restaurant's name
                     // 'approved' and 'submissionDate' set by @PrePersist and default in AuthService
                    authService.registerNewRestaurant(restaurant);
                    break;
                case "courier":
                    Courier courier = new Courier();
                    courier.setEmail(email);
                    courier.setPasswordHash(password); // AuthService will hash it
                    courier.setPhone(phone);
                    courier.setName(name);
                    courier.setAvailable(true); // Default operational availability, can be changed by courier
                     // 'approved' (for registration) and 'submissionDate' set by @PrePersist and default
                    authService.registerNewCourier(courier);
                    break;
                default:
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                         .body(Map.of("message", "Invalid role specified: " + role));
            }
             // Consistent success response
            Map<String, String> response = new HashMap<>();
            response.put("message", "Registration request submitted. Waiting for admin approval.");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) { // Catch specific exceptions from AuthService like "already exists"
             Map<String, String> errorResponse = new HashMap<>();
             errorResponse.put("message", e.getMessage());
             return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        } catch (Exception e) { // General catch-all
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", "An unexpected error occurred during registration: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}