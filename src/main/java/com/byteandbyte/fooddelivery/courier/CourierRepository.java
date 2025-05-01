package com.byteandbyte.fooddelivery.courier;

import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CourierRepository extends CrudRepository<Courier, Long> {

    @Override
    Optional<Courier> findById(Long aLong);

    Optional<Courier> findByEmail(String email);


}
