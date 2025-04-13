package com.byteandbyte.fooddelivery.order;

import com.byteandbyte.fooddelivery.cart.Cart;
import com.byteandbyte.fooddelivery.cart.CartItem;
import com.byteandbyte.fooddelivery.cart.CartItemRepository;
import com.byteandbyte.fooddelivery.cart.CartRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;

    public OrderService(CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
    }

    @Transactional
    public void placeOrder(Customer customer) {
        Cart cart = cartRepository.findByCustomerId(customer.getId());

        if (cart == null) throw new RuntimeException("Cart not found");

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setCustomer(customer);
        order.setCreatedAt(LocalDateTime.now());
        orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFoodItem(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItemRepository.save(orderItem);
        }

        // Clear cart after placing order
        cartItemRepository.deleteAll(cartItems);
    }
}
