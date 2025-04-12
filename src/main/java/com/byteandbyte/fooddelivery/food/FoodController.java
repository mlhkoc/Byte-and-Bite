package com.byteandbyte.fooddelivery.food;

import com.byteandbyte.fooddelivery.menu.Menu;
import com.byteandbyte.fooddelivery.menu.MenuRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api")
public class FoodController {
    private final MenuRepository menuRepository;
    FoodRepository foodRepository;
    public FoodController(MenuRepository menuRepository, FoodRepository foodRepository) {
        this.menuRepository = menuRepository;
        this.foodRepository = foodRepository;
    }



}