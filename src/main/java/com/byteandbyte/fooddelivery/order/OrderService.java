package com.byteandbyte.fooddelivery.order;

import com.byteandbyte.fooddelivery.cart.Cart;
import com.byteandbyte.fooddelivery.cart.CartItem;
import com.byteandbyte.fooddelivery.cart.CartItemRepository;
import com.byteandbyte.fooddelivery.cart.CartRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.food.FoodRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;

import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final FoodRepository foodRepository;

    public OrderService(CartRepository cartRepository,
                        CartItemRepository cartItemRepository,
                        OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        CustomerRepository customerRepository,
                        RestaurantRepository restaurantRepository,
                        FoodRepository foodRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.customerRepository = customerRepository;
        this.restaurantRepository = restaurantRepository;
        this.foodRepository = foodRepository;
    }

    @Transactional
    public void placeOrder(Customer customer) {
        Cart cart = cartRepository.findByCustomerId(customer.getId());

        if (cart == null) throw new RuntimeException("Cart not found");

        List<CartItem> cartItems = cartItemRepository.findByCartId(cart.getId());
        if (cartItems.isEmpty()) throw new RuntimeException("Cart is empty");

        Order order = new Order();
        order.setCustomer(customer);
        order.setOrderTime(LocalDateTime.now());
        orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setFood(cartItem.getFoodItem());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getPrice());
            orderItemRepository.save(orderItem);
        }

        // Clear cart after placing order
        cartItemRepository.deleteAll(cartItems);
    }

    public void createOrder(OrderDTO dto, String customerEmail) {
        Customer customer = customerRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        Restaurant restaurant = restaurantRepository.findById(dto.getRestaurantId()).orElseThrow();

        Order order = new Order();
        order.setCustomer(customer);
        order.setRestaurant(restaurant);
        order.setStatus("PENDING");
        order.setOrderTime(LocalDateTime.now());
        List<OrderItem> items = dto.getItems().stream().map(i -> {
            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setFood(foodRepository.findById(i.getFoodId()).orElseThrow());
            item.setQuantity(i.getQuantity());
            item.setPrice(i.getPrice());
            return item;
        }).collect(Collectors.toList());
        order.setPrice(dto.getTotal());
        order.setItems(items);
        orderRepository.save(order);
    }

    public List<OrderDTO> getOrdersByRestaurant(Long restaurantId) {
        List<Order> orders = orderRepository.findByRestaurantId(restaurantId);
        return orders.stream().map(OrderDTO::fromEntity).collect(Collectors.toList());
    }
}
