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
    private final RestaurantRepository restaurantRepository;
    private final CustomerRepository customerRepository;

    public OrderController(OrderService orderService,
                           RestaurantRepository restaurantRepository,
                           CustomerRepository customerRepository) {
        this.orderService = orderService;
        this.restaurantRepository = restaurantRepository;
        this.customerRepository = customerRepository;
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

    @GetMapping("/orders/customer/{email}")
    public List<OrderDTO> getOrdersForCustomer(@PathVariable String email) {
        Customer customer = customerRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Customer not found"));

        return orderService.getOrdersByCustomer(customer.getId());
    }
}