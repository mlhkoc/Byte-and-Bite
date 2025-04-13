package com.byteandbyte.fooddelivery.food;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FoodService {

    @Autowired
    private FoodRepository foodRepository;

    // Create
    public Food addFood(Food food) {
        return foodRepository.save(food);
    }

    // Read
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    public Food getFoodById(Long id) {
        return foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
    }

    // Update
    public Food updateFood(Long id, Food updatedFood) {
        Food existingFood = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
        existingFood.setName(updatedFood.getName());
        existingFood.setDescription(updatedFood.getDescription());
        existingFood.setPrice(updatedFood.getPrice());
        existingFood.setImage(updatedFood.getImage());
        return foodRepository.save(existingFood);
    }

    // Delete
    public void deleteFood(Long id) {
        Food existingFood = foodRepository.findById(id).orElseThrow(() -> new RuntimeException("Food not found"));
        foodRepository.delete(existingFood);
    }
}