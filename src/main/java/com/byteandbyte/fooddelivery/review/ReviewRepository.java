package com.byteandbyte.fooddelivery.review;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    Review findByOrderId(Long orderId);
}