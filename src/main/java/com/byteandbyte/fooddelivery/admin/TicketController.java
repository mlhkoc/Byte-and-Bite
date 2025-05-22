package com.byteandbyte.fooddelivery.admin;


import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import java.security.Principal;
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

    @PostMapping
    public ResponseEntity<?> createTicket(@RequestBody TicketDTO dto, Principal principal) {
        String email = principal.getName();
        Customer customer = customerService.findByEmail(email);

        if (customer == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Customer not found");
        }

        Ticket ticket = new Ticket();
        ticket.setOrderId(dto.getOrderId());
        ticket.setDescription(dto.getMessage());
        ticket.setCustomer(customer);

        ticketRepository.save(ticket);
        return ResponseEntity.ok().body("Ticket created");
    }

    @GetMapping
    public ResponseEntity<List<TicketDTO>> getAllTickets() {
        List<Ticket> tickets = ticketRepository.findAll();

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
}
