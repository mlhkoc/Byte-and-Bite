package com.byteandbyte.fooddelivery.courier;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CourierService {

    @Autowired
    private CourierRepository courierRepository;




    public Courier findByEmail(String email) {
        return courierRepository.findByEmail(email).orElse(null);

    }

}
