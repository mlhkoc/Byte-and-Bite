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

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.Collections;

import org.springframework.security.core.annotation.AuthenticationPrincipal;

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
        order.setStatus("Picked Up");
        delivery.setOrder(order);;
        delivery.setAddress(order.getAddress());
        courier.getDeliveries().add(delivery);
        courier.setAvailable(false);
        deliveryRepository.save(delivery);
        courierRepository.save(courier);
        orderRepository.save(order);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/me/deliveries")
    public List<DeliveryDTO> getDeliveries(@RequestParam String type, Principal principal) {
        String email = principal.getName(); // Extract email from authenticated user
        Courier courier = courierService.findByEmail(email);

        if (courier == null) {
            throw new UsernameNotFoundException("Courier Not Found!");
        }

        List<DeliveryDTO> deliveries = courier.getDeliveries().stream()
                .map(DeliveryDTO::toDTO)
                .toList();

        return switch (type) {
            case "ACTIVE" -> deliveries.stream()
                    .filter(d -> "Picked Up".equals(d.getStatus()))
                    .collect(Collectors.toList());
            case "PAST" -> deliveries.stream()
                    .filter(d -> "Completed".equals(d.getStatus()))
                    .collect(Collectors.toList());
            default -> Collections.emptyList();
        };
    }

    @PostMapping("/me")
    public ResponseEntity<?> createOrUpdateDelivery(@RequestBody DeliveryDTO deliveryDTO, Principal principal) {
        String email = principal.getName(); // Get authenticated courier email
        Courier courier = courierService.findByEmail(email);
        if (courier == null) {
            throw new UsernameNotFoundException("Courier Not Found!");
        }

        long id = deliveryDTO.getId();
        String newStatus = deliveryDTO.getStatus();

        Delivery delivery = deliveryRepository.findById(id).orElse(null);
        if (delivery == null) {
            throw new UsernameNotFoundException("Delivery Not Found!");
        }

        Order order = delivery.getOrder();

        if ("Picked Up".equals(newStatus)) {
            order.setStatus(newStatus);
            delivery.setStatus(newStatus);
            order.setDelivery(delivery);
            courier.setAvailable(false);
        } else if ("Completed".equals(newStatus)) {
            courier.setAvailable(true);
            delivery.setStatus(newStatus);
            delivery.setDeliveryDate(LocalDateTime.now());
            order.setStatus(newStatus);
            order.setDelivery(delivery);
            order.setDeliveryTime(LocalDateTime.now());
        }

        deliveryRepository.save(delivery);
        orderRepository.save(order);
        courierRepository.save(courier);

        return ResponseEntity.ok().build(); // Return 200 OK with no body
    }

    @GetMapping("/me/availability")
    public ResponseEntity<?> getAvailability(Principal principal) {
        // Your logic to get the availability status
        Courier courier = courierRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Courier not found"));
        return ResponseEntity.ok(courier.isAvailable());
    }

    @PostMapping("/me/availability")
    public ResponseEntity<?> updateAvailability(@RequestBody Map<String, Boolean> availabilityPayload,
            Principal principal) {
        // Your logic to update the availability status
        Courier courier = courierRepository.findByEmail(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Courier not found"));
        courier.setAvailable(availabilityPayload.get("isAvailable"));
        courierRepository.save(courier);
        return ResponseEntity.ok(courier);
    }



}
