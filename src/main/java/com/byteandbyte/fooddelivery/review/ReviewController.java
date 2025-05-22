package com.byteandbyte.fooddelivery.review;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.RequestBody;
import java.security.Principal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.order.OrderRepository;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.order.Order;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewRepository reviewRepository;
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private CustomerRepository customerRepository;
    @Autowired
    private RestaurantRepository restaurantRepository;

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody ReviewDTO dto, Principal principal) {
        Customer customer = customerRepository.findByEmail(principal.getName())
            .orElseThrow(() -> new UsernameNotFoundException("Customer not found"));
        Order order = orderRepository.findById(dto.getOrderId()).orElse(null);
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId()).orElse(null);

        if (customer == null || order == null || restaurant == null) {
            return ResponseEntity.badRequest().body("Invalid data");
        }

        if (order.getReview() != null) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Review already exists");
        }

        Review review = Review.builder()
                .rating(dto.getRating())
                .text(dto.getComment())
                .timestamp(LocalDateTime.now())
                .order(order)
                .customer(customer)
                .restaurant(restaurant)
                .build();

        reviewRepository.save(review);
        order.setReview(review);
        orderRepository.save(order);

        return ResponseEntity.ok("Review submitted successfully");
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getReviewByOrder(@PathVariable Long orderId) {
        Review review = reviewRepository.findByOrderId(orderId);
        if (review == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(review);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<Map<String, Object>>> getReviewsByRestaurant(@PathVariable Long restaurantId) {
        List<Review> reviews = reviewRepository.findByRestaurantId(restaurantId);

        List<Map<String, Object>> response = reviews.stream().map(r -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", r.getId());
            map.put("rating", r.getRating());
            map.put("text", r.getText());
            map.put("timestamp", r.getTimestamp());
            map.put("customerName", r.getCustomer().getName());
            return map;
        }).toList();

        return ResponseEntity.ok(response);
    }
}
