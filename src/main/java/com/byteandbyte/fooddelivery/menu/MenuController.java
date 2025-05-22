package com.byteandbyte.fooddelivery.menu;

import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.food.FoodRepository;
import com.byteandbyte.fooddelivery.food.FoodDTO;
import com.byteandbyte.fooddelivery.food.FoodService;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RestController
@RequestMapping("/api")
public class MenuController {

    private final MenuRepository menuRepository;
    private final FoodRepository foodRepository;
    private final FoodService foodService;
    private final RestaurantRepository restaurantRepository;




    public MenuController(MenuRepository menuRepository, FoodRepository foodRepository, FoodService foodService, RestaurantRepository restaurantRepository) {
        this.menuRepository = menuRepository;
        this.foodRepository = foodRepository;
        this.foodService = foodService;
        this.restaurantRepository = restaurantRepository;

    }

    @GetMapping("/menu/{restaurantId}")
    public List<FoodDTO> getMenuByRestaurant(@PathVariable Long restaurantId) {
        List<Menu> menus = menuRepository.findByRestaurantId(restaurantId);
        List<FoodDTO> foodDtos = new ArrayList<>();

        Restaurant restaurant = restaurantRepository.findById(restaurantId).orElse(null);

        for (Menu menu : menus) {
            for (Food food : foodRepository.findByMenuId(menu.getId())) {
                foodDtos.add(new FoodDTO(food.getId(),food.getName(), food.getDescription(), food.getPrice(),food.isAvailable(),food.getImage(), restaurant.getEmail()));
            }
        }

        return foodDtos;
    }

    @GetMapping("/menuManagement")
    public List<FoodDTO> getMenuIdByMail(Principal principal) {
        List<Menu> menus = menuRepository.findByRestaurantEmail(principal.getName());
        List<FoodDTO> foodDtos = new ArrayList<>();

        for (Menu menu : menus) {
            for (Food food : foodRepository.findByMenuId(menu.getId())) {
                foodDtos.add(new FoodDTO(food.getId(),food.getName(), food.getDescription(), food.getPrice(),food.isAvailable(),food.getImage(),principal.getName()));
            }
        }

        return foodDtos;
    }

    @PostMapping("/menuManagement")
    public ResponseEntity<Food> addFood(@RequestBody Map<String, Object> payload, Principal principal) {
        String image = (String) payload.get("image");
        String description = (String) payload.get("description");
        Number priceNumber = (Number) payload.get("price");
        double price = priceNumber.doubleValue();
        String name = (String) payload.get("name");
        boolean available = Boolean.parseBoolean(payload.get("available").toString());


        Food food = new Food();
        food.setName(name);
        food.setDescription(description);
        food.setImage(image);
        food.setAvailable(available);
        food.setPrice(price);

        Optional<Restaurant> optionalRestaurant = restaurantRepository.findByEmail(principal.getName());
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.badRequest().build(); // or throw an exception
        }

        Restaurant restaurant = optionalRestaurant.get();
        System.out.println(restaurant.getName());

        List<Menu> menus = menuRepository.findByRestaurantEmail(principal.getName());
        Menu menu;
        if (menus.isEmpty()) {
            menu = new Menu();
            menu.setName("Default Menu");
            menu.setRestaurant(restaurant); // associate menu with restaurant
            menuRepository.save(menu); // persist new menu
        } else {
            menu = menus.getFirst(); // use the first menu found
        }

        food.setMenu(menu); // associate food with menu
        Food savedFood = foodRepository.save(food);
        return ResponseEntity.ok(savedFood);

    }

    @PutMapping("/menuManagement/{id}")
        public ResponseEntity<Food> updateFood(@RequestBody Map<String, Object> payload,@PathVariable long id) {


        String image = (String) payload.get("image");
        String description = (String) payload.get("description");
        Number priceNumber = (Number) payload.get("price");
        double price = priceNumber.doubleValue();
        String name = (String) payload.get("name");
        boolean available = Boolean.parseBoolean(payload.get("available").toString());
        Food food = foodRepository.findById(id);
        if (food == null) {
            return ResponseEntity.badRequest().build();
        }
        else{
            food.setName(name);
            food.setDescription(description);
            food.setImage(image);
            food.setAvailable(available);
            food.setPrice(price);
            foodRepository.save(food);
            return ResponseEntity.ok(food);
        }
    }


    @DeleteMapping("/menuManagement/{id}")
    public ResponseEntity<Void> deleteFood(@PathVariable Long id) {
        foodRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }





}
