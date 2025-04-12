package com.byteandbyte.fooddelivery.customer;

import lombok.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;




    public Customer findByEmail(String email) {
        return customerRepository.findByEmail(email).orElse(null);

    }


}