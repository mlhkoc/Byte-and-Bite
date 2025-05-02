package com.byteandbyte.fooddelivery.courier;

import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.order.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/courier")
public class CourierController {


    private final CourierService courierService;

    private final DeliveryRepository deliveryRepository;
    private final CourierRepository courierRepository;
    private final OrderRepository orderRepository;

    public CourierController(CourierService courierService, DeliveryRepository deliveryRepository, CourierRepository courierRepository, OrderRepository orderRepository) {
        this.courierService = courierService;
        this.deliveryRepository = deliveryRepository;
        this.courierRepository = courierRepository;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/{email}/deliveries")
    public List<DeliveryDTO> getDeliveries(@PathVariable String email, @RequestParam String type) {
        Courier courier = courierService.findByEmail(email);
        if (courier == null) {
            throw  new UsernameNotFoundException("Courier Not Found!");
        }

        List<DeliveryDTO> deliveries =  courier.getDeliveries().stream().map(DeliveryDTO::toDTO).toList();
        if(type.equals("ACTIVE")){
            return deliveries.stream().filter(deliveryDTObj -> deliveryDTObj.getStatus().equals("Pending")).collect(Collectors.toList());
        }
        else if (type.equals("PAST")){
            return deliveries.stream().filter(deliveryDTObj -> deliveryDTObj.getStatus().equals("Completed")).collect(Collectors.toList());
        }
        else {
            return null;
        }
    }

    @PostMapping("/{email}")
    public ResponseEntity<?> createDelivery(@PathVariable String email, @RequestBody DeliveryDTO deliveryDTO) {
        long id = deliveryDTO.getId();
        String newStatus = deliveryDTO.getStatus();
        Courier courier = courierService.findByEmail(email);
        if (courier == null) {
            throw  new UsernameNotFoundException("Courier Not Found!");
        }
        Delivery delivery = deliveryRepository.findById(id).orElse(null);
        if (delivery == null) {
            throw  new UsernameNotFoundException("Delivery Not Found!");
        }
        Order order = delivery.getOrder();
        if(newStatus.equals("Picked Up")){
            order.setStatus(newStatus);
            delivery.setStatus(newStatus);
            order.setDelivery(delivery);
            courier.setAvailable(false);

        }
        else if (newStatus.equals("Completed")){
            courier.setAvailable(true);
            delivery.setStatus(newStatus);
            delivery.setDeliveryDate(LocalDateTime.now());
            order.setStatus(newStatus);
            order.setDelivery(delivery);


        }
        deliveryRepository.save(delivery);
        orderRepository.save(order);
        courierRepository.save(courier);
        return null;
    }



}
