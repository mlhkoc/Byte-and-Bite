package com.byteandbyte.fooddelivery.courier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface CourierRepository extends JpaRepository<Courier, Long> {

    @Override
    Optional<Courier> findById(Long aLong);

    Optional<Courier> findByEmail(String email);


}
