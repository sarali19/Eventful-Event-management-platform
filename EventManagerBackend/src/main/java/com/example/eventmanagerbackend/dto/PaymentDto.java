package com.example.eventmanagerbackend.dto;

import com.example.eventmanagerbackend.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentDto {
    private String fullName;
    private String cardNumber;
    private String expirationDate;
    private String cvv;
}
