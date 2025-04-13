package com.byteandbyte.fooddelivery.cart;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByCartId(Long cart);
    CartItem findByCartIdAndFoodItemId(Long cartId, Long foodItemId);

    void deleteAllByCartId(Long cart);
}
