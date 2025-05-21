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

    public Customer updateCustomer(String email, CustomerDTO dto) {
        Customer customer = customerRepository.findByEmail(email).orElse(null);
        if (customer == null)
            return null;

        customer.setName(dto.getFullName());
        customer.setEmail(dto.getEmail());
        customer.setPhone(dto.getPhone());
        customer.setAddress(dto.getAddress());

        return customerRepository.save(customer);
    }
    
}