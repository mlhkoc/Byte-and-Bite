package com.byteandbyte.fooddelivery.order;

import com.byteandbyte.fooddelivery.courier.Courier;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.context.annotation.Bean;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;



@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryDTO {

    private Long id;

    private String restaurantName;

    private String customerName;

    private String status;

    private String address;

    private double total;
    private LocalDateTime deliveryDate;


    public static DeliveryDTO toDTO(Delivery d){
        DeliveryDTO dto = new DeliveryDTO();
        dto.setId(d.getId());
        dto.customerName = d.getOrder().getCustomer().getName();
        dto.restaurantName = d.getOrder().getRestaurant().getName();
        dto.status = d.getStatus().toString();
        dto.address = d.getOrder().getAddress();
        dto.deliveryDate = d.getDeliveryDate();
        return dto;
    }
}
