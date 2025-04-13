package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.customer.CustomerService;
import com.byteandbyte.fooddelivery.restaurant.*;


@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerService customerService;
    private final RestaurantService restaurantService;
    private final RestaurantRepository restaurantRepository;


    @Autowired
    public AuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder, CustomerService customerService, RestaurantService restaurantService, RestaurantRepository restaurantRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerService = customerService;
        this.restaurantService = restaurantService;
        this.restaurantRepository = restaurantRepository;
    }



    public void registerNewCustomer(Customer customer) {
        // Use the plain password (e.g., from a signup form)
        try {
            Customer exist = customerService.findByEmail(customer.getEmail());
            if (exist != null) {
                throw new RuntimeException("Customer already exists");
            }
            String hashedPassword = passwordEncoder.encode(customer.getPasswordHash());
            customer.setPasswordHash(hashedPassword);
            customerRepository.save(customer);

        } catch (RuntimeException e) {
            throw new RuntimeException("Error registering new customer", e);
        }
    }


    public void registerNewRestaurant(Restaurant restaurant){
        try {
            Restaurant exist = restaurantService.findByEmail(restaurant.getEmail());
            if (exist != null) {
                throw new RuntimeException("Customer already exists");
            }
            String hashedPassword = passwordEncoder.encode(restaurant.getPasswordHash());
            restaurant.setPasswordHash(hashedPassword);
            restaurantRepository.save(restaurant);

        } catch (RuntimeException e) {
            throw new RuntimeException("Error registering new customer", e);
        }
    }

}
