package com.byteandbyte.fooddelivery.menu;

import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.food.FoodRepository;
import com.byteandbyte.fooddelivery.food.FoodDTO;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final MenuRepository menuRepository;
    private final FoodRepository foodRepository;


    public MenuController(MenuRepository menuRepository, FoodRepository foodRepository) {
        this.menuRepository = menuRepository;
        this.foodRepository = foodRepository;

    }

    @GetMapping("/{restaurantId}/menu")
    public List<FoodDTO> getMenuByRestaurant(@PathVariable Long restaurantId) {
        List<Menu> menus = menuRepository.findByRestaurantId(restaurantId);
        List<FoodDTO> foodDtos = new ArrayList<>();

        for (Menu menu : menus) {
            for (Food food : foodRepository.findByMenuId(menu.getId())) {
                foodDtos.add(new FoodDTO(food.getId(),food.getName(), food.getDescription(), food.getPrice()));
            }
        }

        return foodDtos;
    }


}
