package com.byteandbyte.fooddelivery.security;

import com.byteandbyte.fooddelivery.admin.Admin;
import com.byteandbyte.fooddelivery.admin.AdminRepository;
import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.courier.CourierRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Collections;
import java.util.Date;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private static final Logger logger = LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Autowired
    private AdminRepository adminRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;
    @Autowired
    private CourierRepository courierRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException, DisabledException {
        logger.debug("Attempting to load user by email: {}", email);
        Date now = new Date();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            logger.info("Admin user found: {}", email);
            return new User(admin.getEmail(), admin.getPasswordHash(), true, true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_ADMIN")));
        }

        Optional<Customer> customerOpt = customerRepository.findByEmail(email);
        if (customerOpt.isPresent()) {
            Customer customer = customerOpt.get();
            logger.info("Customer user found: {}. Approved: {}, Active: {}, Banned (ignored for login): {}, DeactivationEnd: {}",
                    email, customer.isApproved(), customer.isActive(), customer.isBanned(), customer.getDeactivationEndDate());

            if (!customer.isApproved()) {
                logger.warn("Customer {} is NOT APPROVED.", email);
                throw new DisabledException("Müşteri hesabı '" + email + "' onaylanmamış.");
            }
            if (!customer.isActive()) {
                if (customer.getDeactivationEndDate() != null && customer.getDeactivationEndDate().after(now)) {
                    logger.warn("Customer {} is DEACTIVATED until {}.", email, sdf.format(customer.getDeactivationEndDate()));
                    throw new DisabledException("Müşteri hesabı '" + email + "' " + sdf.format(customer.getDeactivationEndDate()) + " tarihine kadar geçici olarak devre dışı bırakılmıştır.");
                } else if (customer.getDeactivationEndDate() != null && !customer.getDeactivationEndDate().after(now)) {
                    // Süre dolmuş ama scheduled task henüz çalıştırmamış olabilir. Login ile aktif etme.
                    // Bu normalde scheduled task'in işi olmalı.
                    logger.warn("Customer {} deactivation period ended. Account should be reactivated by scheduled task or admin.", email);
                     throw new DisabledException("Müşteri hesabının '" + email + "' deaktivasyon süresi doldu. Sistem tarafından otomatik aktifleştirilmesi bekleniyor veya manuel aktivasyon gerekli.");
                } else { // Süresiz deaktif
                    logger.warn("Customer {} is INACTIVE (indefinitely).", email);
                    throw new DisabledException("Müşteri hesabı '" + email + "' geçici olarak devre dışı bırakılmıştır.");
                }
            }
            // Müşteriler banlanmayacağı için 'isBanned' kontrolü login'i etkilemez.
            boolean isCustomerEnabled = customer.isApproved() && customer.isActive();
            return new User(customer.getEmail(), customer.getPasswordHash(), isCustomerEnabled, true, true, true,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_CUSTOMER")));
        }

        Optional<Courier> courierOpt = courierRepository.findByEmail(email);
        if (courierOpt.isPresent()) {
            Courier courier = courierOpt.get();
            logger.info("Courier user found: {}. Approved: {}, Active: {}, Banned: {}, DeactivationEnd: {}",
                    email, courier.isApproved(), courier.isActive(), courier.isBanned(), courier.getDeactivationEndDate());
            if (!courier.isApproved()) {
                logger.warn("Courier {} is NOT APPROVED.", email);
                throw new DisabledException("Kurye hesabı '" + email + "' onay bekliyor.");
            }
            if (courier.isBanned()) {
                logger.warn("Courier {} is BANNED. Reason: {}", email, courier.getBanReason());
                throw new DisabledException("Kurye hesabı '" + email + "' yasaklanmıştır. Sebep: " + (courier.getBanReason() != null ? courier.getBanReason() : "Belirtilmemiş"));
            }
            if (!courier.isActive()) {
                if (courier.getDeactivationEndDate() != null && courier.getDeactivationEndDate().after(now)) {
                    logger.warn("Courier {} is DEACTIVATED until {}.", email, sdf.format(courier.getDeactivationEndDate()));
                    throw new DisabledException("Kurye hesabı '" + email + "' " + sdf.format(courier.getDeactivationEndDate()) + " tarihine kadar geçici olarak devre dışı bırakılmıştır.");
                } else if (courier.getDeactivationEndDate() != null && !courier.getDeactivationEndDate().after(now)) {
                     logger.warn("Courier {} deactivation period ended. Account should be reactivated by scheduled task or admin.", email);
                    throw new DisabledException("Kurye hesabının '" + email + "' deaktivasyon süresi doldu ancak henüz sistem tarafından otomatik olarak aktifleştirilmedi.");
                } else {
                    logger.warn("Courier {} is INACTIVE (indefinitely).", email);
                    throw new DisabledException("Kurye hesabı '" + email + "' geçici olarak devre dışı bırakılmıştır.");
                }
            }
            return new User(courier.getEmail(), courier.getPasswordHash(),
                    courier.isApproved() && courier.isActive() && !courier.isBanned(),
                    true, true, true, Collections.singletonList(new SimpleGrantedAuthority("ROLE_COURIER")));
        }

        Optional<Restaurant> restaurantOpt = restaurantRepository.findByEmail(email);
        if (restaurantOpt.isPresent()) {
            Restaurant restaurant = restaurantOpt.get();
            logger.info("Restaurant user found: {}. Approved: {}, Active: {}, Banned: {}, DeactivationEnd: {}",
                    email, restaurant.isApproved(), restaurant.isActive(), restaurant.isBanned(), restaurant.getDeactivationEndDate());
            if (!restaurant.isApproved()) {
                logger.warn("Restaurant {} is NOT APPROVED.", email);
                throw new DisabledException("Restoran hesabı '" + email + "' onay bekliyor.");
            }
            if (restaurant.isBanned()) {
                logger.warn("Restaurant {} is BANNED. Reason: {}", email, restaurant.getBanReason());
                throw new DisabledException("Restoran hesabı '" + email + "' yasaklanmıştır. Sebep: " + (restaurant.getBanReason() != null ? restaurant.getBanReason() : "Belirtilmemiş"));
            }
            if (!restaurant.isActive()) {
                if (restaurant.getDeactivationEndDate() != null && restaurant.getDeactivationEndDate().after(now)) {
                    logger.warn("Restaurant {} is DEACTIVATED until {}.", email, sdf.format(restaurant.getDeactivationEndDate()));
                    throw new DisabledException("Restoran hesabı '" + email + "' " + sdf.format(restaurant.getDeactivationEndDate()) + " tarihine kadar geçici olarak devre dışı bırakılmıştır.");
                } else if (restaurant.getDeactivationEndDate() != null && !restaurant.getDeactivationEndDate().after(now)) {
                     logger.warn("Restaurant {} deactivation period ended. Account should be reactivated by scheduled task or admin.", email);
                    throw new DisabledException("Restoran hesabının '" + email + "' deaktivasyon süresi doldu ancak henüz sistem tarafından otomatik olarak aktifleştirilmedi.");
                } else {
                    logger.warn("Restaurant {} is INACTIVE (indefinitely).", email);
                    throw new DisabledException("Restoran hesabı '" + email + "' geçici olarak devre dışı bırakılmıştır.");
                }
            }
            return new User(restaurant.getEmail(), restaurant.getPasswordHash(),
                    restaurant.isApproved() && restaurant.isActive() && !restaurant.isBanned(),
                    true, true, true, Collections.singletonList(new SimpleGrantedAuthority("ROLE_RESTAURANT")));
        }

        logger.warn("User not found with email: {}", email);
        throw new UsernameNotFoundException("E-posta adresi bulunamadı: " + email);
    }
}