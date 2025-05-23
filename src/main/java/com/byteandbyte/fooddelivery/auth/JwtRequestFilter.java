package com.byteandbyte.fooddelivery.auth;

import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.*;
import com.byteandbyte.fooddelivery.courier.*;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final RestaurantRepository restaurantRepository;
    private final CourierRepository courierRepository;

    @Autowired
    public AuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder,
                       RestaurantRepository restaurantRepository, CourierRepository courierRepository) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.restaurantRepository = restaurantRepository;
        this.courierRepository = courierRepository;
    }

    @Transactional
    public void registerNewCustomer(Customer customer) {
        if (customerRepository.findByEmail(customer.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with email " + customer.getEmail() + " already exists.");
        }
        customer.setPasswordHash(passwordEncoder.encode(customer.getPasswordHash()));
        customer.setApproved(true); // MÜŞTERİ İÇİN ONAY OTOMATİK OLARAK TRUE
        // customer.setSubmissionDate(new Date()); // Bu @PrePersist ile zaten set ediliyor
        customerRepository.save(customer);
    }

    @Transactional
    public void registerNewCourier(Courier courier) {
         if (courierRepository.findByEmail(courier.getEmail()).isPresent()) {
            throw new RuntimeException("Courier with email " + courier.getEmail() + " already exists.");
        }
        courier.setPasswordHash(passwordEncoder.encode(courier.getPasswordHash()));
        courier.setApproved(false); // Kurye için onay beklenir
        courierRepository.save(courier);
    }

    @Transactional
    public void registerNewRestaurant(Restaurant restaurant){
        if (restaurantRepository.findByEmail(restaurant.getEmail()).isPresent()) {
            throw new RuntimeException("Restaurant with email " + restaurant.getEmail() + " already exists.");
        }
        restaurant.setPasswordHash(passwordEncoder.encode(restaurant.getPasswordHash()));
        restaurant.setApproved(false); // Restoran için onay beklenir
        restaurantRepository.save(restaurant);
    }
}