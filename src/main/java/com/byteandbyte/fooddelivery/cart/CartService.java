package com.byteandbyte.fooddelivery.cart;


import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.food.FoodRepository;
import com.byteandbyte.fooddelivery.restaurant.RestaurantDTO;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.*;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.lang.Math.max;


@Service
public class CartService {
    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private FoodRepository foodRepository;

    public CartItemDTO toDTO(CartItem item){
        long id = item.getFoodItem().getId();
        String name = item.getFoodItem().getName() != null ? item.getFoodItem().getName() : "";
        int quantity = item.getQuantity();
        double price = item.getPrice();
        String image = item.getFoodItem().getImage() != null ? item.getFoodItem().getImage() : "";

        return new CartItemDTO(id,name, quantity, price,image);
    }


    @Transactional
    public List<CartItemDTO> getCart(Long customerId) {
        Cart cart;

        cart = cartRepository.findByCustomerId(customerId);
        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(customerRepository.findById(customerId).orElse(null));
            cartRepository.save(cart);
        }
        return cartItemRepository.findByCartId(cart.getId())
                .stream().map(this::toDTO)
                .collect(Collectors.toList());

    }


    @Transactional
    public CartItem addToCart(Long customerId, long itemId, String name, double price, String image) {
        Cart cart = cartRepository.findByCustomerId(customerId);
        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(customerRepository.findById(customerId).orElse(null));
            cartRepository.save(cart);
        }
        Optional<CartItem> existingItem = cartItemRepository.findByCartId(cart.getId()).stream().filter(cartItem -> cartItem.getFoodItem().getId().equals(itemId)).findFirst();
        if (existingItem.isPresent()) {
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + 1);
            item.setPrice(item.getPrice() + price);
            return cartItemRepository.save(item);
        } else {
            Food food = foodRepository.findById(itemId);
            if (food == null) {
                throw new RuntimeException("Food not found");
            }
            CartItem newItem = new CartItem();
            newItem.setFoodItem(food);
            newItem.setQuantity(1);
            newItem.setPrice(price);
            newItem.setCart(cart); // You can create a user entity or pass from the context
            return cartItemRepository.save(newItem);
        }
    }

    @Transactional
    public void removeFromCart(Long userId, Long foodId) {
        Cart cart = cartRepository.findByCustomerId(userId);
        CartItem item = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), foodId);
        if (item != null) {
            cartItemRepository.delete(item);
        }
    }

    @Transactional
    public void updateQuantity(Long userId, Long foodId, int quantity) {
        Cart cart = cartRepository.findByCustomerId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(customerRepository.findById(userId).orElse(null));
            cartRepository.save(cart);
        }
        CartItem item = cartItemRepository.findByCartIdAndFoodItemId(cart.getId(), foodId);
        if (item != null) {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }

    }

    @Transactional
    public void clearCart(Long userId) {
        Cart cart = cartRepository.findByCustomerId(userId);
        if (cart == null) {
            cart = new Cart();
            cart.setCustomer(customerRepository.findById(userId).orElse(null));
            cartRepository.save(cart);
        }

        cartItemRepository.deleteAllByCartId(cart.getId());
    }
}