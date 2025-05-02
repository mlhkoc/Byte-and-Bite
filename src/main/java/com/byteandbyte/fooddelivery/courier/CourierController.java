package com.byteandbyte.fooddelivery.courier;

import com.byteandbyte.fooddelivery.food.Food;
import com.byteandbyte.fooddelivery.order.*;

import jakarta.persistence.Id;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
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


    @GetMapping("/get")
    public List<CourierDTO> getAllCouriers() {
        return courierRepository.findAll()
                .stream()
                .filter(Courier::isAvailable)
                .map(CourierDTO::from)
                .collect(Collectors.toList());
    }

    @PostMapping("/id/{courierId}")
    public ResponseEntity<?> assignCourier(@PathVariable Long courierId, @RequestBody Map<String, Object> payload) {
        Courier courier = courierRepository.findById(courierId).orElse(null);
        if (courier == null) {
            return ResponseEntity.notFound().build();
        }
        Delivery delivery = new Delivery();
        delivery.setCourier(courier);
        delivery.setStatus("Picked Up");
        Long orderId = Long.parseLong(payload.get("id").toString());
        Order order = orderRepository.getReferenceById(orderId);
        order.setDelivery(delivery);
        delivery.setOrder(order);;
        courier.getDeliveries().add(delivery);
        courier.setAvailable(false);
        deliveryRepository.save(delivery);
        courierRepository.save(courier);
        orderRepository.save(order);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/{email}/deliveries")
    public List<DeliveryDTO> getDeliveries(@PathVariable String email, @RequestParam String type) {
        Courier courier = courierService.findByEmail(email);
        if (courier == null) {
            System.out.println("COURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIERCOURIER");
            throw  new UsernameNotFoundException("Courier Not Found!");
        }

        List<DeliveryDTO> deliveries =  courier.getDeliveries().stream().map(DeliveryDTO::toDTO).toList();
        if(type.equals("ACTIVE")){
            return deliveries.stream().filter(deliveryDTObj -> deliveryDTObj.getStatus().equals("Picked Up")).collect(Collectors.toList());
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
