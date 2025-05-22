package com.byteandbyte.fooddelivery.admin;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map; // For potential banUser payload

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService; // Autowire the new AdminService

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/pending-registrations")
    public ResponseEntity<List<PendingRegistrationDTO>> getPendingRegistrations() {
        List<PendingRegistrationDTO> requests = adminService.getPendingRegistrations();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/approve-registration/{type}/{id}")
    public ResponseEntity<?> approveRegistration(@PathVariable String type, @PathVariable Long id) {
        try {
            boolean success = adminService.approveRegistration(type, id);
            if (success) {
                return ResponseEntity.ok(Map.of("message", type + " with ID " + id + " approved successfully."));
            } else {
                 // This path might not be reached if exceptions are thrown for not found
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/reject-registration/{type}/{id}")
    public ResponseEntity<?> rejectRegistration(@PathVariable String type, @PathVariable Long id) {
         try {
            boolean success = adminService.rejectRegistration(type, id);
            if (success) {
                 return ResponseEntity.ok(Map.of("message", type + " with ID " + id + " rejected successfully."));
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // --- Existing Endpoints (keep or modify as needed) ---
    @GetMapping("/tickets")
    public String getTickets() {
        return "Hello World! (Tickets - Not Implemented)";
    }

    // This endpoint is now replaced by /pending-registrations
    // @GetMapping("/requests")
    // public String getRequests() {
    //     return "Hello World! (Requests - Use /pending-registrations)";
    // }

    @PostMapping("/solveticket")
    public String solveTicket() {
        // Consider what payload this would take
        return "Hello World! (Solve Ticket - Not Implemented)";
    }

    @PostMapping("/ban")
    public String banUser() {
        // Example: @RequestBody Map<String, String> payload (e.g., {"email": "user@example.com"})
        // adminService.banUser(payload.get("email"));
        return "Hello World! (Ban User - Not Implemented via API yet, connect to AdminService logic)";
    }

    // This might be for an admin creating a user directly, distinct from user self-signup
    @PostMapping("/register")
    public String registerUser() {
        // Example: @RequestBody UserCreationDTO payload
        // adminService.adminCreateUser(payload);
        return "Hello World! (Admin Manual Register - Not Implemented)";
    }
}