package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
// import com.byteandbyte.fooddelivery.customer.CustomerService; // Not strictly needed if using repo directly
import com.byteandbyte.fooddelivery.restaurant.*;
import com.byteandbyte.fooddelivery.courier.*;
import org.springframework.transaction.annotation.Transactional; // Import Transactional

// import java.util.Date; // Not needed if @PrePersist handles submissionDate

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    // private final CustomerService customerService; // Can be removed if only using repo.findByEmail
    // private final RestaurantService restaurantService; // Can be removed
    private final RestaurantRepository restaurantRepository;
    // private final CourierService courierService; // Can be removed
    private final CourierRepository courierRepository;


    @Autowired
    public AuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder,
                       /*CustomerService customerService, RestaurantService restaurantService,*/
                       RestaurantRepository restaurantRepository, /*CourierService courierService,*/
                       CourierRepository courierRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        // this.customerService = customerService;
        // this.restaurantService = restaurantService;
        this.restaurantRepository = restaurantRepository;
        // this.courierService = courierService;
        this.courierRepository = courierRepository;
    }


    @Transactional
    public void registerNewCustomer(Customer customer) {
        // Check if email exists
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with email " + customer.getEmail() + " already exists.");
        }
        customer.setPasswordHash(passwordEncoder.encode(customer.getPasswordHash()));
        customer.setApproved(false); // Explicitly set for clarity, though default is false
        // customer.setSubmissionDate(new Date()); // This will be handled by @PrePersist
        customerRepository.save(customer);
    }

    @Transactional
    public void registerNewCourier(Courier courier) {
         if (courierRepository.findByEmail(courier.getEmail()).isPresent()) {
            throw new RuntimeException("Courier with email " + courier.getEmail() + " already exists.");
        }
        courier.setPasswordHash(passwordEncoder.encode(courier.getPasswordHash()));
        courier.setApproved(false);
        // courier.setSubmissionDate(new Date()); // Handled by @PrePersist
        courierRepository.save(courier);
    }

    @Transactional
    public void registerNewRestaurant(Restaurant restaurant){
        if (restaurantRepository.findByEmail(restaurant.getEmail()).isPresent()) {
            throw new RuntimeException("Restaurant with email " + restaurant.getEmail() + " already exists.");
        }
        restaurant.setPasswordHash(passwordEncoder.encode(restaurant.getPasswordHash()));
        restaurant.setApproved(false);
        // restaurant.setSubmissionDate(new Date()); // Handled by @PrePersist
        restaurantRepository.save(restaurant);
    }
}