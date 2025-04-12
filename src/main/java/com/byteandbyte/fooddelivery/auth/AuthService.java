package com.byteandbyte.fooddelivery.auth;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.customer.CustomerService;


@Service
public class AuthService {

    private final CustomerRepository customerRepository;
    private final PasswordEncoder passwordEncoder;
    private final CustomerService customerService;



    @Autowired
    public AuthService(CustomerRepository customerRepository, PasswordEncoder passwordEncoder, CustomerService customerService) {
        this.customerRepository = customerRepository;
        this.passwordEncoder = passwordEncoder;
        this.customerService = customerService;
    }



    public void registerNewCustomer(Customer customer) {
        // Use the plain password (e.g., from a signup form)
        try {
            Customer exist =  customerService.findByEmail(customer.getEmail());
            if (exist != null) {
                throw new RuntimeException("Customer already exists");
            }
            String hashedPassword = passwordEncoder.encode(customer.getPasswordHash());
            customer.setPasswordHash(hashedPassword);
            customerRepository.save(customer);

        }
        catch (RuntimeException e) {
            throw new RuntimeException("Error registering new customer", e);
        }


    }
}
