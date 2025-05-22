package com.byteandbyte.fooddelivery.courier;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository; // Add Repository annotation

import java.util.List; // Import List
import java.util.Optional;

@Repository // Add Repository annotation
public interface CourierRepository extends JpaRepository<Courier, Long> {

    // @Override // No need to override, JpaRepository provides findById
    // Optional<Courier> findById(Long aLong);

    Optional<Courier> findByEmail(String email);
    List<Courier> findByApprovedFalseOrderBySubmissionDateDesc(); // New method
}