package com.byteandbyte.fooddelivery.order;

import com.byteandbyte.fooddelivery.cart.CartItemDTO;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;

    public OrderController(OrderService orderService,
                           CustomerRepository customerRepository,
                           RestaurantRepository restaurantRepository) {
        this.orderService = orderService;
        this.customerRepository = customerRepository;
        this.restaurantRepository = restaurantRepository;
    }

    @PostMapping("/order/{customerEmail}")
    public ResponseEntity<String> placeOrder(
            @PathVariable String customerEmail,
            @RequestBody(required = false) List<CartItemDTO> items // optional, you can also fetch from DB
    ) {
        Customer customer = customerRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Customer not found");
        }

        try {
            orderService.placeOrder(customer);
            return ResponseEntity.ok("Order placed successfully");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to place order");
        }
    }

    @PostMapping("/orders/checkout")
    public ResponseEntity<?> checkout(@RequestBody OrderDTO orderDTO, Principal principal) {
        orderService.createOrder(orderDTO, principal.getName());
        return ResponseEntity.ok("Order placed successfully.");
    }

    @GetMapping("/orders/restaurant")
    public List<OrderDTO> getOrdersForRestaurant(Principal principal) {
        Restaurant restaurant = restaurantRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new RuntimeException("Restaurant not found"));

        return orderService.getOrdersByRestaurant(restaurant.getId());
    }
}