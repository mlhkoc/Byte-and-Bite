package com.byteandbyte.fooddelivery.admin;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private static final Logger logger = LoggerFactory.getLogger(AdminController.class);
    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // --- PENDING REGISTRATION ENDPOINTS ---
    @GetMapping("/pending-registrations")
    public ResponseEntity<List<PendingRegistrationDTO>> getPendingRegistrations() {
        List<PendingRegistrationDTO> requests = adminService.getPendingRegistrations();
        return ResponseEntity.ok(requests);
    }

    @PostMapping("/approve-registration/{type}/{id}")
    public ResponseEntity<?> approveRegistration(@PathVariable String type, @PathVariable Long id) {
        try {
            adminService.approveRegistration(type, id);
            return ResponseEntity.ok(Map.of("message", type.toUpperCase() + " with ID " + id + " approved successfully."));
        } catch (IllegalArgumentException e) {
            logger.error("Error approving registration for type: {}, ID: {}. Error: {}", type, id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error approving registration for type: {}, ID: {}", type, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    @PostMapping("/reject-registration/{type}/{id}")
    public ResponseEntity<?> rejectRegistration(@PathVariable String type, @PathVariable Long id) {
        try {
            adminService.rejectRegistration(type, id);
            return ResponseEntity.ok(Map.of("message", type.toUpperCase() + " with ID " + id + " rejected and deleted successfully."));
        } catch (IllegalArgumentException e) {
            logger.error("Error rejecting registration for type: {}, ID: {}. Error: {}", type, id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error rejecting registration for type: {}, ID: {}", type, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // --- USER MANAGEMENT ENDPOINTS ---

    @GetMapping("/users")
    public ResponseEntity<List<UserManagementDTO>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search) {
        try {
            List<UserManagementDTO> users = adminService.getAllUsers(role, status, search);
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            logger.error("Error fetching all users with filters role: {}, status: {}, search: {}", role, status, search, e);
            return ResponseEntity.status(500).body(null); // Veya uygun bir hata DTO'su
        }
    }

    @GetMapping("/users/{role}/{id}")
    public ResponseEntity<?> getUserDetails(@PathVariable String role, @PathVariable Long id) {
        try {
            UserManagementDTO user = adminService.getUserDetails(role, id);
            return ResponseEntity.ok(user);
        } catch (IllegalArgumentException e) {
            logger.warn("User details not found for role: {}, ID: {}. Error: {}", role, id, e.getMessage());
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error fetching user details for role: {}, ID: {}", role, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    // Kullanıcı bilgilerini güncelleme yetkisi olmadığı için bu endpoint kaldırıldı.
    // @PutMapping("/users/{role}/{id}")

    @PostMapping("/users/{role}/{id}/deactivate")
    public ResponseEntity<?> deactivateUserUntil(
            @PathVariable String role,
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {
        try {
            String endDateString = payload.get("endDate"); // Format: "yyyy-MM-dd'T'HH:mm" (veya frontend ne gönderiyorsa)
            String reason = payload.get("reason"); // Opsiyonel

            if (endDateString == null || endDateString.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "endDate is required. Example format: 2025-12-31T23:59"));
            }

            Date endDate;
            try {
                // Frontend'den gelen ISO benzeri formatı veya spesifik bir formatı parse et
                // Örnek: "2025-05-23T10:15"
                SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm");
                // sdf.setTimeZone(TimeZone.getTimeZone("UTC")); // Gerekirse TimeZone ayarı
                endDate = sdf.parse(endDateString);
            } catch (ParseException e) {
                logger.error("Invalid endDate format received: {}. Expected yyyy-MM-dd'T'HH:mm", endDateString, e);
                return ResponseEntity.badRequest().body(Map.of("error", "Invalid endDate format. Use yyyy-MM-dd'T'HH:mm. Received: " + endDateString));
            }

            adminService.deactivateUserUntil(role, id, endDate, reason);
            return ResponseEntity.ok(Map.of("message", "User " + role.toUpperCase() + " ID: " + id + " deactivated until " + endDateString));
        } catch (IllegalArgumentException e) {
            logger.error("Error deactivating user role: {}, ID: {}. Error: {}", role, id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error deactivating user role: {}, ID: {}", role, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    @PostMapping("/users/{role}/{id}/activate")
    public ResponseEntity<?> activateUser(@PathVariable String role, @PathVariable Long id) {
        try {
            adminService.activateUser(role, id);
            return ResponseEntity.ok(Map.of("message", "User " + role.toUpperCase() + " ID: " + id + " activated successfully."));
        } catch (IllegalArgumentException e) {
            logger.error("Error activating user role: {}, ID: {}. Error: {}", role, id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error activating user role: {}, ID: {}", role, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    @PostMapping("/users/{role}/{id}/set-ban")
    public ResponseEntity<?> setUserBanStatus(@PathVariable String role, @PathVariable Long id, @RequestBody Map<String, Object> payload) {
        try {
            Boolean banned = (Boolean) payload.get("banned");
            String banReason = payload.containsKey("banReason") ? (String) payload.get("banReason") : null;

            if (banned == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "'banned' status (true/false) is required in payload."));
            }

            adminService.setUserBanStatus(role, id, banned, banReason);
            String action = banned ? "banned" : "unbanned";
            return ResponseEntity.ok(Map.of("message", "User " + action + " successfully for " + role.toUpperCase() + " ID: " + id));
        } catch (IllegalArgumentException e) {
            logger.error("Error setting ban status for user role: {}, ID: {}. Error: {}", role, id, e.getMessage());
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error setting ban status for user role: {}, ID: {}", role, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "An unexpected error occurred."));
        }
    }

    @DeleteMapping("/users/{role}/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String role, @PathVariable Long id) {
        try {
            boolean deleted = adminService.deleteUser(role, id);
            if(deleted) {
                return ResponseEntity.ok(Map.of("message", "User deleted successfully: " + role.toUpperCase() + " ID: " + id));
            } else {
                // Bu duruma normalde AdminService exception fırlatacağı için girilmemeli
                return ResponseEntity.status(500).body(Map.of("error", "User deletion failed for an unknown reason."));
            }
        } catch (IllegalArgumentException e) {
            logger.error("Error deleting user role: {}, ID: {}. Error: {}", role, id, e.getMessage());
            return ResponseEntity.status(404).body(Map.of("error", e.getMessage())); // Not Found daha uygun olabilir
        } catch (Exception e) { // Örneğin DataIntegrityViolationException
            logger.error("Unexpected error deleting user role: {}, ID: {}. This might be due to existing related data.", role, id, e);
            return ResponseEntity.status(500).body(Map.of("error", "Could not delete user. There might be related data (e.g., orders, deliveries). Details: " + e.getMessage()));
        }
    }

    // --- PLACEHOLDER ENDPOINTS ---
    @GetMapping("/tickets")
    public String getTickets() {
        return "Hello World! (Tickets - Not Implemented)";
    }

    @PostMapping("/solveticket")
    public String solveTicket() {
        return "Hello World! (Solve Ticket - Not Implemented)";
    }

    @PostMapping("/register")
    public String registerUser() {
        return "Hello World! (Admin Manual Register - Not Implemented)";
    }
}