package com.byteandbyte.fooddelivery.security;


import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.courier.CourierRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.Collections;


@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private CourierRepository courierRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        Restaurant restaurant = restaurantRepository.findByEmail(email).orElse(null);
        Courier courier = courierRepository.findByEmail(email).orElse(null);
        if (customer != null){
            return new org.springframework.security.core.userdetails.User(
                    customer.getEmail(),
                    customer.getPasswordHash(), // this must be the encoded password!
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        }
        if (courier != null){
            return new org.springframework.security.core.userdetails.User(
                    courier.getEmail(),
                    courier.getPasswordHash(), // this must be the encoded password!
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_COURIER")));
        }
        if (restaurant != null){
            return new org.springframework.security.core.userdetails.User(
                    restaurant.getEmail(),
                    restaurant.getPasswordHash(), // this must be the encoded password!
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_RESTAURANT")));
        }
        throw new UsernameNotFoundException(email);

    }
}
