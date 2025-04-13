package com.byteandbyte.fooddelivery.security;


import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
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

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Customer customer = customerRepository.findByEmail(email).orElse(null);

        if (customer == null) {
            Restaurant restaurant = restaurantRepository.findByEmail(email).orElse(null);
            if (restaurant == null) {
                throw new UsernameNotFoundException(email);
            }
            else return new org.springframework.security.core.userdetails.User(
                    restaurant.getEmail(),
                    restaurant.getPasswordHash(), // this must be the encoded password!
                    Collections.singletonList(new SimpleGrantedAuthority("RESTAURANT")));
        }else return new org.springframework.security.core.userdetails.User(
                customer.getEmail(),
                customer.getPasswordHash(), // this must be the encoded password!
                Collections.singletonList(new SimpleGrantedAuthority("CUSTOMER")));
    }
}
