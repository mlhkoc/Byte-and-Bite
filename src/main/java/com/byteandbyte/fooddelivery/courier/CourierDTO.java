package com.byteandbyte.fooddelivery.courier;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourierDTO {

    private long id;
    private String name;


    public static CourierDTO from(Courier courier) {
        CourierDTO dto = new CourierDTO();
        dto.id = courier.getId();
        dto.name = courier.getName();
        return dto;
    }
}
