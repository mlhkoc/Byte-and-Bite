package com.byteandbyte.fooddelivery.customer;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.http.ResponseEntity;

import java.security.Principal;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @GetMapping("/{email}")
    public ResponseEntity<CustomerDTO> getCustomerByEmail(@PathVariable String email) {
        Customer customer = customerService.findByEmail(email);
        if (customer == null)
            return ResponseEntity.notFound().build();

        CustomerDTO dto = new CustomerDTO();
        dto.setFullName(customer.getName());
        dto.setEmail(customer.getEmail());
        dto.setPhone(customer.getPhone());
        dto.setAddress(customer.getAddress());

        return ResponseEntity.ok(dto);
    }



    @PutMapping("/{email}")
    public ResponseEntity<CustomerDTO> updateCustomer(@PathVariable String email,
            @RequestBody CustomerDTO dto) {
        Customer updated = customerService.updateCustomer(email, dto);
        if (updated == null)
            return ResponseEntity.notFound().build();

        CustomerDTO result = new CustomerDTO();
        result.setFullName(updated.getName());
        result.setEmail(updated.getEmail());
        result.setPhone(updated.getPhone());
        result.setAddress(updated.getAddress());

        return ResponseEntity.ok(result);
    }
}
