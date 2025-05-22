package com.byteandbyte.fooddelivery.restaurant;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List; // Import List
import java.util.Optional;

@Repository
public interface RestaurantRepository extends JpaRepository<Restaurant, Long> {
    Optional<Restaurant> findByEmail(String email);
    List<Restaurant> findByApprovedFalseOrderBySubmissionDateDesc(); // New method
}