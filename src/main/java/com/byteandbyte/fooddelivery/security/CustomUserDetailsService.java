package com.byteandbyte.fooddelivery.security;

import com.byteandbyte.fooddelivery.admin.Admin; // Admin import edildi
import com.byteandbyte.fooddelivery.admin.AdminRepository; // AdminRepository import edildi
import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.courier.CourierRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private AdminRepository adminRepository; // Bu zaten vardı

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private CourierRepository courierRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException, DisabledException {
        // Önce Admin olarak yüklemeyi dene
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            // Admin için 'approved' durumu kontrolü genellikle olmaz,
            // adminler sisteme önceden tanımlanır ve her zaman aktiftir.
            return new User(
                    admin.getEmail(),
                    admin.getPasswordHash(),
                    true, // enabled
                    true, // accountNonExpired
                    true, // credentialsNonExpired
                    true, // accountNonLocked
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN"))
            );
        }

        // Sonra Müşteri olarak yüklemeyi dene
        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            if (!customer.isApproved()) {
                throw new DisabledException("Müşteri hesabı '" + email + "' onay bekliyor veya reddedildi.");
            }
            return new User(
                    customer.getEmail(),
                    customer.getPasswordHash(),
                    customer.isApproved(),
                    true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER"))
            );
        }

        // Sonra Kurye olarak yüklemeyi dene
        Optional<Courier> courierOpt = courierRepository.findByEmail(email);
        if (courierOpt.isPresent()) {
            Courier courier = courierOpt.get();
            if (!courier.isApproved()) {
                throw new DisabledException("Kurye hesabı '" + email + "' onay bekliyor veya reddedildi.");
            }
            return new User(
                    courier.getEmail(),
                    courier.getPasswordHash(),
                    courier.isApproved(),
                    true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_COURIER"))
            );
        }

        // Son olarak Restoran olarak yüklemeyi dene
        Optional<Restaurant> restaurantOpt = restaurantRepository.findByEmail(email);
        if (restaurantOpt.isPresent()) {
            Restaurant restaurant = restaurantOpt.get();
            if (!restaurant.isApproved()) {
                throw new DisabledException("Restoran hesabı '" + email + "' onay bekliyor veya reddedildi.");
            }
            return new User(
                    restaurant.getEmail(),
                    restaurant.getPasswordHash(),
                    restaurant.isApproved(),
                    true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_RESTAURANT"))
            );
        }

        throw new UsernameNotFoundException("E-posta adresi bulunamadı: " + email);
    }
}