package com.byteandbyte.fooddelivery.menu;

import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.food.FoodRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/{restaurantId}")
public class MenuController {

    private final MenuRepository menuRepository;
    private final FoodRepository foodRepository;


    @Autowired
    public MenuController(MenuRepository menuRepository, FoodRepository foodRepository) {
        this.menuRepository = menuRepository;
        this.foodRepository = foodRepository;

    }

    @GetMapping("/menu")
    public List<Food> getMenuByRestaurant(@PathVariable Long restaurantId) {
        List<Menu> list = menuRepository.findByRestaurantId(restaurantId);
        List<Food> foodList = new ArrayList<>();
        for(Menu menuItem : list){
            foodList.addAll(foodRepository.findByMenuId(menuItem.getId()));
        }
        return foodList;
    }


}
