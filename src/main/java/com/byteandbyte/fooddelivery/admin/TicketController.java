package com.byteandbyte.fooddelivery.admin;


import com.byteandbyte.fooddelivery.order.Order;
import com.byteandbyte.fooddelivery.order.OrderRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import org.springframework.web.bind.annotation.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.security.Principal;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import java.util.List;


import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerService;

@RestController
@RequestMapping("/api/tickets")
public class TicketController {

    @Autowired
    private TicketRepository ticketRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private OrderRepository orderRepository;


    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketDTO dto, Principal principal) {
        String email = principal.getName();
        Customer customer = customerService.findByEmail(email);

        if (customer == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Customer not found");
        }

        Order order = orderRepository.findById(dto.getOrderId()).orElse(null);

        if (order == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Order not found");
        }

        Restaurant restaurant = order.getRestaurant();

        Ticket ticket = new Ticket();
        ticket.setOrderId(dto.getOrderId());
        ticket.setRestaurant(restaurant);
        ticket.setDescription(dto.getMessage());
        ticket.setCustomer(customer);
        ticket.setCreatedAt(LocalDateTime.now());
        ticket.setStatus("PENDING");
        ticket.setCourier(order.getDelivery().getCourier());

        ticketRepository.save(ticket);
        return ResponseEntity.ok().body("Ticket created");
    }

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll().stream().filter(ticket -> ticket.getStatus().equals("PENDING")).collect(Collectors.toList());
        List<TicketDTO> dtos = tickets.stream().map(ticket -> {
            TicketDTO dto = new TicketDTO();
            dto.setId(ticket.getId());
            dto.setOrderId(ticket.getOrderId());
            dto.setCustomerEmail(ticket.getCustomer().getEmail());
            dto.setMessage(ticket.getDescription());
            dto.setStatus(ticket.getStatus()); // Optional: if you track status
            return dto;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> closeTicket(@PathVariable("id") long id, @RequestBody Map<String, String> body) {
        Ticket ticket = ticketRepository.findById(id).orElse(null);
        if (ticket == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Ticket not found");
        }
        String status = body.get("status");
        ticket.setStatus(status);
        ticketRepository.save(ticket);
        return ResponseEntity.ok().body("Ticket closed");
    }
}
