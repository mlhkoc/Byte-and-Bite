package com.byteandbyte.fooddelivery.admin; // Ensure correct package

import com.byteandbyte.fooddelivery.courier.Courier;
import com.byteandbyte.fooddelivery.courier.CourierRepository;
import com.byteandbyte.fooddelivery.customer.Customer;
import com.byteandbyte.fooddelivery.customer.CustomerRepository;
import com.byteandbyte.fooddelivery.restaurant.Restaurant;
import com.byteandbyte.fooddelivery.restaurant.RestaurantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminService {

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

    public List<PendingRegistrationDTO> getPendingRegistrations() {
        List<PendingRegistrationDTO> customerRequests = customerRepository.findByApprovedFalseOrderBySubmissionDateDesc()
                .stream()
                .map(c -> new PendingRegistrationDTO(c.getId(), c.getName(), c.getEmail(), "CUSTOMER", c.getSubmissionDate()))
                .collect(Collectors.toList());

        List<PendingRegistrationDTO> restaurantRequests = restaurantRepository.findByApprovedFalseOrderBySubmissionDateDesc()
                .stream()
                .map(r -> new PendingRegistrationDTO(r.getId(), r.getName(), r.getEmail(), "RESTAURANT", r.getSubmissionDate()))
                .collect(Collectors.toList());

        List<PendingRegistrationDTO> courierRequests = courierRepository.findByApprovedFalseOrderBySubmissionDateDesc()
                .stream()
                .map(co -> new PendingRegistrationDTO(co.getId(), co.getName(), co.getEmail(), "COURIER", co.getSubmissionDate()))
                .collect(Collectors.toList());

        List<PendingRegistrationDTO> allPending = new ArrayList<>();
        allPending.addAll(customerRequests);
        allPending.addAll(restaurantRequests);
        allPending.addAll(courierRequests);

        // Sort by submission date, newest first
        allPending.sort(Comparator.comparing(PendingRegistrationDTO::getSubmissionDate, Comparator.nullsLast(Comparator.reverseOrder())));


        return allPending;
    }

    @Transactional
    public boolean approveRegistration(String type, Long id) {
        switch (type.toUpperCase()) {
            case "CUSTOMER":
                Customer customer = customerRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Customer not found with id: " + id));
                customer.setApproved(true);
                customerRepository.save(customer);
                return true;
            case "RESTAURANT":
                Restaurant restaurant = restaurantRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Restaurant not found with id: " + id));
                restaurant.setApproved(true);
                restaurantRepository.save(restaurant);
                return true;
            case "COURIER":
                Courier courier = courierRepository.findById(id)
                        .orElseThrow(() -> new IllegalArgumentException("Courier not found with id: " + id));
                courier.setApproved(true);
                courierRepository.save(courier);
                return true;
            default:
                throw new IllegalArgumentException("Invalid registration type: " + type);
        }
    }

    @Transactional
    public boolean rejectRegistration(String type, Long id) {
        // For rejection, we are deleting the record.
        // Alternatively, you could mark as rejected (e.g., add a 'status' field with values PENDING, APPROVED, REJECTED).
        // Or simply leave 'approved' as false and the CustomUserDetailsService will prevent login.
        // Deleting is a clean way if rejected users should not persist.
        switch (type.toUpperCase()) {
            case "CUSTOMER":
                if (!customerRepository.existsById(id)) throw new IllegalArgumentException("Customer not found for rejection: " + id);
                customerRepository.deleteById(id);
                return true;
            case "RESTAURANT":
                if (!restaurantRepository.existsById(id)) throw new IllegalArgumentException("Restaurant not found for rejection: " + id);
                restaurantRepository.deleteById(id);
                return true;
            case "COURIER":
                 if (!courierRepository.existsById(id)) throw new IllegalArgumentException("Courier not found for rejection: " + id);
                courierRepository.deleteById(id);
                return true;
            default:
                throw new IllegalArgumentException("Invalid registration type: " + type);
        }
    }
}