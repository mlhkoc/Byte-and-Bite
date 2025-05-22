package com.byteandbyte.fooddelivery.admin;


import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {


    @GetMapping("/tickets")
    public String getTickets() {
        return "Hello World!";
    }

    @GetMapping("/requests")
    public String getRequests() {
        return "Hello World!";
    }


    @PostMapping("/solveticket")
    public String solveTicket() {
        return "Hello World!";
    }

    @PostMapping("/ban")
    public String banUser() {
        return "Hello World!";
    }

    @PostMapping("/register")
    public String registerUser() {
        return "Hello World!";
    }



}
