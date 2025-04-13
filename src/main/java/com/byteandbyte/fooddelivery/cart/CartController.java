package com.byteandbyte.fooddelivery.cart;

import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.customer.CustomerService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;


import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/cart")
public class CartController {

    private static final Logger logger = LoggerFactory.getLogger(CartController.class);



    @Autowired
    private CartService cartService;

    @Autowired
    CustomerService customerService;
    @Autowired
    private CustomerRepository customerRepository;

    @GetMapping("/{customerEmail}")
    public List<CartItemDTO> getCart(@PathVariable String customerEmail) {

        Customer customer = customerRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found");
        }
        return cartService.getCart(customer.getId());
    }

    @PostMapping("/{customerEmail}")
    public CartItem addToCart(@RequestBody Map<String, Object> payload, @PathVariable String customerEmail) {
        long foodId = Long.parseLong(payload.get("id").toString());
        String name = payload.get("name").toString();
        double price = Double.parseDouble(payload.get("price").toString());
        String image = payload.get("image").toString();

        Customer customer = customerRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found");
        }
        return cartService.addToCart(customer.getId(), foodId,name,price,image);
    }

    @PutMapping("/{customerEmail}/{foodId}")
    public void updateQuantity(@PathVariable Long foodId,@PathVariable String customerEmail ,@RequestBody int quantity) {
        Customer customer = customerRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found");
        }

        cartService.updateQuantity(customer.getId(), foodId, quantity);
    }

    @DeleteMapping("/{customerEmail}/{foodId}")
    public void removeFromCart(@PathVariable Long foodId,@PathVariable String customerEmail ) {
        Customer customer = customerRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found");
        }
        cartService.removeFromCart(customer.getId(), foodId);
    }

    @DeleteMapping("/{customerEmail}/all")
    public void clearCart(@PathVariable String customerEmail) {
        Customer customer = customerRepository.findByEmail(customerEmail).orElse(null);
        if (customer == null) {
            throw new RuntimeException("Customer not found");
        }
        cartService.clearCart(customer.getId());
    }

}