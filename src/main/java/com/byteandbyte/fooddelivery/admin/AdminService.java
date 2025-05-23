package com.byteandbyte.fooddelivery.admin;

import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.courier.CourierRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException; // Import edildi
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Service
public class AdminService {

    private static final Logger logger = LoggerFactory.getLogger(AdminService.class);

    private final CustomerRepository customerRepository;
    private final RestaurantRepository restaurantRepository;
    private final CourierRepository courierRepository;

    @Autowired
    public AdminService(CustomerRepository customerRepository,
                        RestaurantRepository restaurantRepository,
                        CourierRepository courierRepository) {
        this.customerRepository = customerRepository;
        this.restaurantRepository = restaurantRepository;
        this.courierRepository = courierRepository;
    }

    // --- PENDING REGISTRATION MANAGEMENT ---
    public List<PendingRegistrationDTO> getPendingRegistrations() {
        List<PendingRegistrationDTO> restaurantRequests = restaurantRepository.findByApprovedFalseOrderBySubmissionDateDesc()
                .stream()
                .map(r -> new PendingRegistrationDTO(r.getId(), r.getName(), r.getEmail(), "RESTAURANT", r.getSubmissionDate()))
                .collect(Collectors.toList());

        List<PendingRegistrationDTO> courierRequests = courierRepository.findByApprovedFalseOrderBySubmissionDateDesc()
                .stream()
                .map(co -> new PendingRegistrationDTO(co.getId(), co.getName(), co.getEmail(), "COURIER", co.getSubmissionDate()))
                .collect(Collectors.toList());

        List<PendingRegistrationDTO> allPending = new ArrayList<>();
        allPending.addAll(restaurantRequests);
        allPending.addAll(courierRequests);

        allPending.sort(Comparator.comparing(PendingRegistrationDTO::getSubmissionDate, Comparator.nullsLast(Comparator.reverseOrder())));
        return allPending;
    }

    @Transactional
    public boolean approveRegistration(String type, Long id) {
        logger.info("[APPROVE] Raw type: '{}', ID: {}", type, id);
        String processedType = type.toUpperCase(Locale.ENGLISH);
        logger.info("[APPROVE] Processed type (Locale.ENGLISH): '{}'", processedType);

        if ("RESTAURANT".equals(processedType)) {
            Restaurant restaurant = restaurantRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + id));
            restaurant.setApproved(true);
            restaurant.setActive(true);
            restaurantRepository.save(restaurant);
            return true;
        } else if ("COURIER".equals(processedType)) {
            Courier courier = courierRepository.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Courier not found with id: " + id));
            courier.setApproved(true);
            courier.setActive(true);
            courierRepository.save(courier);
            return true;
        } else {
            throw new IllegalArgumentException("Invalid registration type for manual approval: " + type);
        }
    }

    @Transactional
    public boolean rejectRegistration(String type, Long id) {
        logger.info("[REJECT] Raw type: '{}', ID: {}", type, id);
        String processedType = type.toUpperCase(Locale.ENGLISH);
        logger.info("[REJECT] Processed type (Locale.ENGLISH): '{}'", processedType);

        if ("RESTAURANT".equals(processedType)) {
            if (!restaurantRepository.existsById(id)) throw new IllegalArgumentException("Restaurant not found for rejection: " + id);
            // İlişkili verileri (Menu, Order) silmek veya null'a çekmek gerekebilir.
            // CascadeType.DELETE veya orphanRemoval=true ayarları entity'de varsa Hibernate halleder.
            // Yoksa, önce ilişkili verileri manuel silmeniz gerekebilir.
            try {
                restaurantRepository.deleteById(id);
            } catch (DataIntegrityViolationException e) {
                logger.error("Could not delete restaurant with ID {}. It might have related data (menus, orders).", id, e);
                throw new IllegalArgumentException("Cannot delete restaurant with ID " + id + " due to existing related data. Please remove or reassign related items first.");
            }
            return true;
        } else if ("COURIER".equals(processedType)) {
            if (!courierRepository.existsById(id)) throw new IllegalArgumentException("Courier not found for rejection: " + id);
            // İlişkili Delivery'leri silmek veya courier_id'sini null yapmak gerekebilir.
            try {
                courierRepository.deleteById(id);
            } catch (DataIntegrityViolationException e) {
                logger.error("Could not delete courier with ID {}. It might have related deliveries.", id, e);
                throw new IllegalArgumentException("Cannot delete courier with ID " + id + " due to existing related deliveries. Please reassign or complete deliveries first.");
            }
            return true;
        } else {
            throw new IllegalArgumentException("Invalid registration type for manual rejection: " + type);
        }
    }

    // --- USER MANAGEMENT ---
    public List<UserManagementDTO> getAllUsers(String roleFilter, String statusFilter, String searchTerm) {
        List<UserManagementDTO> allUsers = new ArrayList<>();
        customerRepository.findAll().forEach(c -> allUsers.add(UserManagementDTO.fromCustomer(c)));
        restaurantRepository.findAll().forEach(r -> allUsers.add(UserManagementDTO.fromRestaurant(r)));
        courierRepository.findAll().forEach(co -> allUsers.add(UserManagementDTO.fromCourier(co)));

        Stream<UserManagementDTO> userStream = allUsers.stream();

        if (roleFilter != null && !roleFilter.trim().isEmpty() && !roleFilter.equalsIgnoreCase("ALL")) {
            userStream = userStream.filter(user -> user.getRole().equalsIgnoreCase(roleFilter.trim()));
        }
        if (statusFilter != null && !statusFilter.trim().isEmpty()) {
            String upperStatusFilter = statusFilter.toUpperCase(Locale.ENGLISH).trim();
            switch (upperStatusFilter) {
                case "ACTIVE":
                    userStream = userStream.filter(user -> user.isApproved() && user.isActive() && !user.isBanned());
                    break;
                case "INACTIVE":
                    userStream = userStream.filter(user -> user.isApproved() && !user.isActive() && !user.isBanned());
                    break;
                case "BANNED":
                    userStream = userStream.filter(UserManagementDTO::isBanned);
                    break;
                case "PENDING_APPROVAL":
                    userStream = userStream.filter(user -> !user.isApproved() && (user.getRole().equals("RESTAURANT") || user.getRole().equals("COURIER")));
                    break;
            }
        }
        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String lowerSearchTerm = searchTerm.toLowerCase(Locale.ENGLISH).trim();
            userStream = userStream.filter(user ->
                    (user.getName() != null && user.getName().toLowerCase(Locale.ENGLISH).contains(lowerSearchTerm)) ||
                    (user.getEmail() != null && user.getEmail().toLowerCase(Locale.ENGLISH).contains(lowerSearchTerm)) ||
                    (user.getPhone() != null && user.getPhone().replace(" ", "").contains(lowerSearchTerm.replace(" ", "")))
            );
        }
        return userStream
                .sorted(Comparator.comparing(UserManagementDTO::getRole).thenComparing(UserManagementDTO::getId))
                .collect(Collectors.toList());
    }

    public UserManagementDTO getUserDetails(String role, Long id) {
        String processedRole = role.toUpperCase(Locale.ENGLISH);
        switch (processedRole) {
            case "CUSTOMER":
                return customerRepository.findById(id).map(UserManagementDTO::fromCustomer)
                        .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
            case "RESTAURANT":
                return restaurantRepository.findById(id).map(UserManagementDTO::fromRestaurant)
                        .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + id));
            case "COURIER":
                return courierRepository.findById(id).map(UserManagementDTO::fromCourier)
                        .orElseThrow(() -> new IllegalArgumentException("Courier not found with id: " + id));
            default:
                throw new IllegalArgumentException("Invalid user role: " + role);
        }
    }

    @Transactional
    public boolean deactivateUserUntil(String role, Long id, Date endDate, String deactivationReason) {
        String processedRole = role.toUpperCase(Locale.ENGLISH);
        logger.info("Deactivating user - Role: {}, ID: {}, Until: {}, Reason: {}", processedRole, id, endDate, deactivationReason);
        Object userEntity = findUserEntity(processedRole, id);

        if (userEntity instanceof Customer) {
            Customer customer = (Customer) userEntity;
            customer.setActive(false);
            customer.setDeactivationEndDate(endDate);
            customerRepository.save(customer);
        } else if (userEntity instanceof Restaurant) {
            Restaurant restaurant = (Restaurant) userEntity;
            restaurant.setActive(false);
            restaurant.setDeactivationEndDate(endDate);
            restaurantRepository.save(restaurant);
        } else if (userEntity instanceof Courier) {
            Courier courier = (Courier) userEntity;
            courier.setActive(false);
            courier.setDeactivationEndDate(endDate);
            courierRepository.save(courier);
        } else {
            throw new IllegalArgumentException("Invalid role for deactivation: " + role);
        }
        return true;
    }

    @Transactional
    public boolean activateUser(String role, Long id) {
        String processedRole = role.toUpperCase(Locale.ENGLISH);
        logger.info("Activating user - Role: {}, ID: {}", processedRole, id);
        Object userEntity = findUserEntity(processedRole, id);

        if (userEntity instanceof Customer) {
            Customer customer = (Customer) userEntity;
            customer.setActive(true);
            customer.setDeactivationEndDate(null);
            customerRepository.save(customer);
        } else if (userEntity instanceof Restaurant) {
            Restaurant restaurant = (Restaurant) userEntity;
            restaurant.setActive(true);
            restaurant.setDeactivationEndDate(null);
            restaurantRepository.save(restaurant);
        } else if (userEntity instanceof Courier) {
            Courier courier = (Courier) userEntity;
            courier.setActive(true);
            courier.setDeactivationEndDate(null);
            courierRepository.save(courier);
        } else {
            throw new IllegalArgumentException("Invalid role for activation: " + role);
        }
        return true;
    }

    @Transactional
    public boolean setUserBanStatus(String role, Long id, boolean banned, String banReason) {
        String processedRole = role.toUpperCase(Locale.ENGLISH);
        logger.info("Setting ban status for role: {}, ID: {}, banned: {}, reason: '{}'", processedRole, id, banned, banReason);
        Object userEntity = findUserEntity(processedRole, id);

        if (userEntity instanceof Customer) {
            logger.warn("Attempted to set ban status for a CUSTOMER (ID: {}), which is not allowed.", id);
            throw new IllegalArgumentException("Customers cannot be banned or unbanned.");
        } else if (userEntity instanceof Restaurant) {
            Restaurant restaurant = (Restaurant) userEntity;
            restaurant.setBanned(banned);
            restaurant.setBanReason(banned ? banReason : null);
            if (banned) {
                restaurant.setActive(false);
                restaurant.setDeactivationEndDate(null);
            }
            restaurantRepository.save(restaurant);
        } else if (userEntity instanceof Courier) {
            Courier courier = (Courier) userEntity;
            courier.setBanned(banned);
            courier.setBanReason(banned ? banReason : null);
            if (banned) {
                courier.setActive(false);
                courier.setDeactivationEndDate(null);
            }
            courierRepository.save(courier);
        } else {
            throw new IllegalArgumentException("Invalid role for setting ban status: " + role);
        }
        return true;
    }

    @Transactional
    public boolean deleteUser(String role, Long id) {
        String processedRole = role.toUpperCase(Locale.ENGLISH);
        logger.info("Attempting to delete user. Role: '{}', ID: {}", processedRole, id);
        try {
            switch (processedRole) {
                case "CUSTOMER":
                    if (!customerRepository.existsById(id)) throw new IllegalArgumentException("Customer not found for deletion with ID: " + id);
                    // Müşterinin siparişleri varsa ne olacak? Ya cascade delete ya da önce siparişleri handle et.
                    // Şimdilik direkt silmeyi deniyoruz.
                    customerRepository.deleteById(id);
                    logger.info("Customer with ID {} deleted.", id);
                    return true;
                case "RESTAURANT":
                    if (!restaurantRepository.existsById(id)) throw new IllegalArgumentException("Restaurant not found for deletion with ID: " + id);
                    // Restoranın menüleri, yemekleri, siparişleri varsa ne olacak?
                    // Entity'lerde CascadeType.ALL veya orphanRemoval=true varsa ilişkili olanlar da silinir.
                    // Yoksa DataIntegrityViolationException alırsınız.
                    Restaurant restaurant = restaurantRepository.findById(id).get(); // Silmeden önce ilişkileri temizlemek için
                    // Örnek: restaurant.getMenus().clear(); // Eğer menüler silinmeyecekse
                    restaurantRepository.delete(restaurant); // veya deleteById(id)
                    logger.info("Restaurant with ID {} deleted.", id);
                    return true;
                case "COURIER":
                    if (!courierRepository.existsById(id)) throw new IllegalArgumentException("Courier not found for deletion with ID: " + id);
                    // Kuryenin teslimatları varsa ne olacak?
                    Courier courier = courierRepository.findById(id).get();
                    // Örnek: courier.getDeliveries().forEach(d -> d.setCourier(null)); courierRepository.save(courier);
                    // Ya da CascadeType ile yönetilmeli.
                    courierRepository.delete(courier); // veya deleteById(id)
                    logger.info("Courier with ID {} deleted.", id);
                    return true;
                default:
                    throw new IllegalArgumentException("Invalid role for deletion: " + role);
            }
        } catch (DataIntegrityViolationException e) {
            logger.error("Data integrity violation while deleting {} with ID {}. Related data exists.", processedRole, id, e);
            throw new IllegalArgumentException("Cannot delete " + processedRole + ". There is related data (e.g., orders, menus, deliveries) that must be handled first. Details: " + e.getMessage());
        } catch (Exception e) {
            logger.error("Error deleting {} with ID {}.", processedRole, id, e);
            throw e; // Re-throw diğer beklenmedik hatalar için
        }
    }

    // Yardımcı metot
    private Object findUserEntity(String processedRole, Long id) {
        switch (processedRole) {
            case "CUSTOMER":
                return customerRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Customer not found with ID: " + id));
            case "RESTAURANT":
                return restaurantRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Restaurant not found with ID: " + id));
            case "COURIER":
                return courierRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Courier not found with ID: " + id));
            default:
                throw new IllegalArgumentException("Invalid user role: " + processedRole);
        }
    }

    // --- OTOMATİK AKTİVASYON İÇİN (Scheduled Task ile çağrılacak) ---
    @Transactional
    public void reactivateUsersWithExpiredDeactivation() {
        Date now = new Date();
        logger.info("SCHEDULER_SERVICE: Checking for users to reactivate at {}", now);

        // Müşteriler
        customerRepository.findAll().stream()
            .filter(c -> !c.isActive() && c.getDeactivationEndDate() != null && c.getDeactivationEndDate().before(now) && !c.isBanned())
            .forEach(customer -> {
                logger.info("SCHEDULER_SERVICE: Reactivating customer: {} (ID: {})", customer.getEmail(), customer.getId());
                customer.setActive(true);
                customer.setDeactivationEndDate(null);
                customerRepository.save(customer);
            });

        // Restoranlar
        restaurantRepository.findAll().stream()
            .filter(r -> !r.isActive() && r.getDeactivationEndDate() != null && r.getDeactivationEndDate().before(now) && !r.isBanned())
            .forEach(restaurant -> {
                logger.info("SCHEDULER_SERVICE: Reactivating restaurant: {} (ID: {})", restaurant.getName(), restaurant.getId());
                restaurant.setActive(true);
                restaurant.setDeactivationEndDate(null);
                restaurantRepository.save(restaurant);
            });

        // Kuryeler
        courierRepository.findAll().stream()
            .filter(co -> !co.isActive() && co.getDeactivationEndDate() != null && co.getDeactivationEndDate().before(now) && !co.isBanned())
            .forEach(courier -> {
                logger.info("SCHEDULER_SERVICE: Reactivating courier: {} (ID: {})", courier.getName(), courier.getId());
                courier.setActive(true);
                courier.setDeactivationEndDate(null);
                courierRepository.save(courier);
            });
    }
}