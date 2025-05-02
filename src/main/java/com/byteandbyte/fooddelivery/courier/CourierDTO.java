package com.byteandbyte.fooddelivery.courier;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CourierDTO {

    private long id;
    private String name;
    private String avatar;


    public static CourierDTO from(Courier courier) {
        CourierDTO dto = new CourierDTO();
        dto.id = courier.getId();
        dto.name = courier.getName();
        dto.setAvatar("https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png");

        return dto;
    }
}
